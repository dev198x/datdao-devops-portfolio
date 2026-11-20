// Database schema section of the "Booking online - EKS && GitHub Actions" project.
// Core schema for availability checks and conflict detection (resources + bookings), the same
// model explained in the blog post on overlap detection. Schema only: no real data, no credentials.

import type { DatabaseSection } from './chatbot-database';

export const BOOKING_DATABASE: DatabaseSection = {
  engine: 'PostgreSQL (TIMESTAMPTZ + btree_gist cho EXCLUDE constraint)',
  summary:
    'Schema lõi phục vụ bài toán không đặt trùng lịch: bảng resources là thứ được đặt (phòng, bác sĩ, xe, bàn...) và bảng bookings là từng lượt đặt trên một khoảng thời gian. Mọi quy tắc quan trọng (giờ hợp lệ, không trùng lịch) được đặt ngay trong database để đúng cả khi hai request đến cùng lúc hoặc code ứng dụng có lỗi.',
  principles: [
    'Thời gian lưu bằng TIMESTAMPTZ (UTC), chỉ đổi sang giờ địa phương khi hiển thị, nên không bị lệch múi giờ',
    'Khoảng thời gian là nửa mở [start_time, end_time): lịch 09:00-10:00 và 10:00-11:00 đặt liền nhau được',
    'Database là lớp bảo vệ cuối: CHECK chặn giờ sai, EXCLUDE constraint chặn trùng lịch kể cả khi có race condition',
    'Huỷ lịch bằng đổi status thành CANCELLED (không xoá dòng), và các lịch đã huỷ được loại khỏi kiểm tra trùng và index',
  ],
  relations: `resources 1 ──< bookings    (bookings.resource_id FK -> resources.id)

Một resource có nhiều booking; mỗi booking thuộc đúng một resource.
Ràng buộc chống trùng áp dụng cho từng resource_id riêng:
cùng resource thì không được chồng giờ, khác resource thì độc lập.`,
  relationNotes: [
    'bookings.user_id chưa có FK vì bảng người dùng nằm ngoài phạm vi schema lõi này',
    'Có thể khoá dòng resources (SELECT ... FOR UPDATE) để tuần tự hoá các lần đặt cùng một resource trên DB không có EXCLUDE',
  ],
  tables: [
    {
      name: 'resources',
      group: 'Tài nguyên',
      purpose: 'Thứ có thể được đặt. Mỗi dòng là một phòng họp, một bác sĩ, một chiếc xe... Đóng vai trò dòng "cha" để khoá và để gắn lịch.',
      columns: [
        { name: 'id', type: 'BIGSERIAL PK', note: 'Mã tài nguyên, tự tăng. Bảng bookings tham chiếu cột này qua resource_id' },
        { name: 'name', type: 'VARCHAR(100) NOT NULL', note: 'Tên hiển thị của tài nguyên (phòng họp, bác sĩ, xe...). Giới hạn 100 ký tự, không được để trống' },
      ],
      notes: ['Dòng của bảng này cũng là chỗ để khoá khi cần xếp hàng các lần đặt cùng một tài nguyên'],
    },
    {
      name: 'bookings',
      group: 'Đặt lịch',
      purpose: 'Mỗi dòng là một lượt đặt một tài nguyên trong một khoảng thời gian. Đây là bảng mà kiểm tra trùng lịch và constraint làm việc trực tiếp.',
      columns: [
        { name: 'id', type: 'BIGSERIAL PK', note: 'Mã lượt đặt, tự tăng. Dùng để tra cứu, huỷ, đổi lịch, và để loại chính nó khi kiểm tra trùng lúc đổi lịch' },
        { name: 'resource_id', type: 'BIGINT NOT NULL FK', note: 'Tài nguyên được đặt, tham chiếu resources(id). Không cho đặt vào tài nguyên không tồn tại. Là cột đầu của index và của constraint chống trùng' },
        { name: 'user_id', type: 'BIGINT NOT NULL', note: 'Người đặt. Dùng để lọc "lịch của tôi" và kiểm tra quyền sở hữu; chưa có FK vì bảng người dùng nằm ngoài schema này' },
        { name: 'start_time', type: 'TIMESTAMPTZ NOT NULL', note: 'Thời điểm bắt đầu (bao gồm). TIMESTAMPTZ lưu theo UTC, không dùng TIMESTAMP để tránh sai múi giờ' },
        { name: 'end_time', type: 'TIMESTAMPTZ NOT NULL', note: 'Thời điểm kết thúc (không bao gồm). Phải lớn hơn start_time; đặt đúng bằng start_time của lịch sau là hợp lệ (đặt liền nhau)' },
        { name: 'status', type: "VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED'", note: 'CONFIRMED (đang giữ chỗ) | CANCELLED (đã huỷ, không còn chiếm chỗ). Huỷ bằng đổi status, giữ lại dòng làm lịch sử' },
        { name: 'created_at', type: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()', note: 'Thời điểm tạo dòng, để audit và sắp xếp. Do database tự điền' },
      ],
      notes: [
        'CHECK chk_booking_time: start_time < end_time, chặn khoảng thời gian rỗng hoặc ngược ngay cả khi code quên kiểm tra',
        'Index idx_bookings_resource_time (resource_id, start_time, end_time) WHERE status <> \'CANCELLED\': phục vụ câu kiểm tra trùng, nhỏ và nhanh vì bỏ qua lịch đã huỷ',
        'EXCLUDE no_overlapping_bookings: hai lịch cùng resource_id không được chồng khoảng thời gian (trừ lịch CANCELLED)',
      ],
    },
  ],
  ddl: [
    {
      language: 'sql',
      caption: 'resources + bookings, comment từng field',
      code: `CREATE TABLE resources (
  id   BIGSERIAL PRIMARY KEY,           -- mã tài nguyên, tự tăng
  name VARCHAR(100) NOT NULL            -- tên hiển thị: phòng họp, bác sĩ, xe...
);

CREATE TABLE bookings (
  id          BIGSERIAL PRIMARY KEY,    -- mã lượt đặt, tự tăng
  resource_id BIGINT NOT NULL           -- tài nguyên được đặt
              REFERENCES resources(id), --   FK: không đặt vào tài nguyên không tồn tại
  user_id     BIGINT NOT NULL,          -- người đặt (chưa có FK, bảng user ở ngoài schema này)
  start_time  TIMESTAMPTZ NOT NULL,     -- bắt đầu (bao gồm), lưu UTC
  end_time    TIMESTAMPTZ NOT NULL,     -- kết thúc (không bao gồm), phải sau start_time
  status      VARCHAR(16) NOT NULL      -- CONFIRMED = đang giữ chỗ
              DEFAULT 'CONFIRMED',      -- CANCELLED = đã huỷ, không chiếm chỗ
  created_at  TIMESTAMPTZ NOT NULL      -- thời điểm tạo dòng, để audit
              DEFAULT NOW(),
  CONSTRAINT chk_booking_time           -- lớp bảo vệ cuối cho đầu vào
    CHECK (start_time < end_time)
);`,
    },
    {
      language: 'sql',
      caption: 'Index và constraint chống trùng lịch',
      code: `-- Index một phần: chỉ lịch chưa huỷ, nhỏ hơn và nhanh hơn cho câu kiểm tra trùng
CREATE INDEX idx_bookings_resource_time
  ON bookings (resource_id, start_time, end_time)
  WHERE status <> 'CANCELLED';

-- Để database tự chặn race condition: cùng resource_id không được chồng khoảng thời gian
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- cho phép dùng "=" trên resource_id trong GiST

ALTER TABLE bookings
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    resource_id WITH =,                                -- cùng tài nguyên
    tstzrange(start_time, end_time, '[)') WITH &&      -- và khoảng thời gian giao nhau ('[)' = nửa mở)
  ) WHERE (status <> 'CANCELLED');                     -- lịch đã huỷ không tính`,
    },
  ],
  queries: [
    {
      language: 'sql',
      caption: 'Kiểm tra khung giờ còn trống không',
      code: `SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND status <> 'CANCELLED'                      -- bỏ qua lịch đã huỷ
    AND start_time < '2026-12-01 03:30:00+00'      -- newEnd   (10:30 giờ VN = 03:30 UTC)
    AND end_time   > '2026-12-01 02:30:00+00'      -- newStart (09:30 giờ VN = 02:30 UTC)
) AS is_overlapping;  -- true = bị trùng, false = còn trống`,
    },
    {
      language: 'sql',
      caption: 'Đặt lịch trên DB không có EXCLUDE: khoá dòng resource',
      code: `BEGIN;
SELECT id FROM resources WHERE id = 1 FOR UPDATE;   -- người đến sau chờ ở đây

-- chạy câu kiểm tra trùng ở trên; nếu is_overlapping = false thì:
INSERT INTO bookings (resource_id, user_id, start_time, end_time)
VALUES (1, 101, '2026-12-01 02:30:00+00', '2026-12-01 03:30:00+00');
COMMIT;`,
    },
  ],
  limitations: [
    'Đây là schema lõi cho kiểm tra trùng lịch. Các phần được mô tả ở trên của project (reservation hold có TTL, idempotency key, state machine đơn hàng, thanh toán) chưa được mô hình hoá thành bảng trong phần này',
    'status chỉ có hai giá trị CONFIRMED và CANCELLED, được kiểm soát ở tầng ứng dụng (chưa có CHECK hoặc ENUM)',
    'Literal thời gian luôn ghi kèm offset (+00 = UTC). Literal không có offset sẽ được hiểu theo TimeZone của session, dễ lệch giờ nếu server hoặc client đặt múi giờ khác',
    'Khoá dòng resources xếp hàng cả các lần đặt khác ngày của cùng một tài nguyên; EXCLUDE constraint tránh được nhược điểm này nhưng chỉ có trên PostgreSQL',
  ],
};
