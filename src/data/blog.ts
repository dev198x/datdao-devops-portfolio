import type { categoryColors } from '../components/visual/VisualComponents';

export interface BlogPost {
  id: number;
  /** URL segment: /blog/{slug}. Lowercase ASCII + hyphens, unique, never change after publishing. */
  slug: string;
  title: string;
  category: keyof typeof categoryColors;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  date: string;
  featured: boolean;
  excerpt: string;
  tags: string[];
  heroImage?: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 2,
    slug: 'terraform-best-practices-for-aws',
    title: "Infrastructure as Code: Terraform Best Practices for AWS",
    category: "Cloud Infrastructure",
    difficulty: "Advanced",
    readTime: "12 min read",
    date: "2025-01-10",
    featured: false,
    excerpt: "Master Terraform infrastructure management with proven patterns, state management, and security practices for AWS deployments.",
    tags: ["Terraform", "AWS", "IaC", "Security", "Best Practices"],
    content: `
# Infrastructure as Code: Terraform Best Practices for AWS

Terraform has revolutionized how we manage infrastructure. This guide covers essential best practices for managing AWS resources with Terraform.

## Project Structure

Organize your Terraform code for maintainability and reusability:

\`\`\`
terraform/
├── modules/
│   ├── vpc/
│   ├── ecs/
│   └── rds/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── shared/
    └── variables.tf
\`\`\`

## State Management

Use remote state storage to maintain state across team members:

\`\`\`hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-west-2"
    
    dynamodb_table = "terraform-state-lock"
  }
}
\`\`\`

## Security Best Practices

1. Use separate AWS accounts for different environments
2. Implement least privilege IAM policies
3. Enable encryption at rest and in transit
4. Use Terraform variables for sensitive data
5. Implement state encryption

## Module Reusability

Create reusable modules that can be shared across projects:

\`\`\`hcl
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  region      = var.region
  
  cidr_block = "10.0.0.0/16"
}
\`\`\`

## Conclusion

Following these best practices will help you maintain scalable, secure, and maintainable infrastructure with Terraform.
    `
  },
  {
    id: 8,
    slug: 'row-locking-select-for-update',
    title: "Row Locking in SQL: SELECT ... FOR UPDATE Without the Footguns",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "8 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Cách Row Locking ngăn lost update và race condition, các timeout nào bảo vệ bạn khi transaction bị treo, và bốn quy tắc giúp SELECT ... FOR UPDATE không làm sập database.",
    tags: ["PostgreSQL", "MySQL", "Concurrency", "Transactions", "Database"],
    content: `
# Row Locking in SQL: SELECT ... FOR UPDATE Without the Footguns

Hai request cùng mua món hàng cuối cùng trong kho tại cùng một thời điểm. Cả hai đều đọc \`stock = 1\`, cả hai đều pass điều kiện kiểm tra, cả hai đều trừ kho. Bạn vừa bán một thứ mình không có. Đây là Lost Update, và một câu \`SELECT\` thông thường không thể ngăn được. Row Locking thì có thể.

## Row Locking làm gì

\`SELECT ... FOR UPDATE\` đặt một exclusive lock lên các row mà nó trả về, trong phạm vi transaction hiện tại. Các transaction khác vẫn đọc bình thường những row đó, nhưng không thể update, delete hay lock chúng cho đến khi bạn kết thúc. Những row không ai chạm tới vẫn hoàn toàn khả dụng, nên khác với table lock, cái giá chỉ giới hạn ở những chỗ thực sự có tranh chấp.

## Hai transaction tương tác thế nào

Giả sử T1 và T2 cùng chạy \`SELECT ... FOR UPDATE\` trên cùng một row.

1. Lock Manager cấp exclusive lock cho transaction đến trước, giả sử là T1.
2. T2 bị đưa vào Lock Wait Queue và tạm dừng tại câu lệnh đó.
3. T1 xử lý xong và kết thúc bằng COMMIT hoặc ROLLBACK. Đó là thời điểm duy nhất khóa được giải phóng.
4. T2 được đánh thức, nhận khóa và đọc đúng trạng thái T1 vừa commit, nên điều kiện nghiệp vụ của nó thấy được dữ liệu thật.

\`\`\`sql
BEGIN;
SELECT stock FROM products WHERE id = 42 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 42 AND stock >= 1;
COMMIT;
\`\`\`

## Chọn cách chờ

Mặc định là chặn (block). Có hai biến thể thay đổi hành vi này:

\`\`\`sql
-- báo lỗi ngay nếu row đang bị khóa, để app trả về "đang bận"
SELECT * FROM seats WHERE id = 7 FOR UPDATE NOWAIT;

-- bỏ qua các row đang bị khóa và lấy row trống kế tiếp, lý tưởng cho job queue
SELECT * FROM jobs WHERE status = 'pending'
ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
\`\`\`

NOWAIT phù hợp với thao tác của người dùng, nơi một câu "thử lại sau" nhanh tốt hơn một request bị treo. SKIP LOCKED cho phép nhiều worker lấy các row khác nhau song song mà không cần message broker riêng. Cả hai đều có từ PostgreSQL 9.5+ và MySQL 8.0+.

## Chuyện gì xảy ra khi có thứ bị treo

Mỗi sự cố ảnh hưởng đến một transaction khác nhau, và mỗi loại cần một timeout riêng:

\`\`\`
T1 giữ khóa quá lâu, T2 đứng chờ     -> T2 nhận lỗi    lock_timeout (PG, mặc định không giới hạn)
                                                       innodb_lock_wait_timeout (MySQL, mặc định 50s)
T1 "ngủ quên" sau khi lấy khóa       -> T1 bị cắt      idle_in_transaction_session_timeout (PG, mặc định tắt)
                                                       wait_timeout (MySQL, mặc định 8h) + app timeout
T1 chạy câu SQL quá nặng             -> T1 bị cắt      statement_timeout (PG) / max_execution_time (MySQL)
T1 và T2 khóa chéo row của nhau      -> DB chọn một bên làm nạn nhân và rollback (Deadlock Detector)
\`\`\`

Điểm quan trọng: trên PostgreSQL gần như tất cả đều mặc định là "không giới hạn". Nếu bạn không đặt, một transaction bị kẹt có thể kéo mọi request khác xếp hàng phía sau cho đến khi Connection Pool cạn kiệt.

## Bốn quy tắc để dùng an toàn

### 1. Đảm bảo WHERE dùng được index

Việc khóa đi theo access path. Với MySQL InnoDB, \`FOR UPDATE\` trên cột không có index sẽ quét toàn bảng và khóa mọi row nó quét qua, gần như chặn các writer khác nặng không kém table lock. PostgreSQL chỉ khóa các row được trả về, nhưng Full Table Scan vẫn chậm và giữ khóa lâu hơn. Hãy chạy \`EXPLAIN\` trước.

### 2. Khóa theo thứ tự cố định

Deadlock sinh ra từ vòng chờ: T1 giữ A và cần B, T2 giữ B và cần A. Nếu mọi transaction đều khóa nhiều row theo cùng một thứ tự, vòng chờ không thể hình thành.

\`\`\`sql
BEGIN;
SELECT id, balance FROM accounts WHERE id IN (101, 202) ORDER BY id FOR UPDATE;
UPDATE accounts SET balance = balance - 50 WHERE id = 101;
UPDATE accounts SET balance = balance + 50 WHERE id = 202;
COMMIT;
\`\`\`

Deadlock Detector chỉ là lưới an toàn, không phải kế hoạch. Nó rollback một bên, nên code của bạn vẫn cần retry cho loại lỗi này.

### 3. Giữ transaction ngắn

Không gọi External API, gửi email hay xử lý file giữa BEGIN và COMMIT. Mỗi mili-giây tiêu tốn ở đó là một mili-giây mà mọi transaction khác trên row đó phải chờ.

### 4. Đặt timeout ở cả hai tầng

Dùng Transaction Timeout ở tầng ứng dụng (30 đến 60 giây) cùng với các giới hạn ở tầng database:

\`\`\`sql
SET lock_timeout = '5s';
SET statement_timeout = '30s';
SET idle_in_transaction_session_timeout = '60s';
\`\`\`

Cách này ngăn một transaction chậm biến thành Cascading Failure lan ra toàn bộ service.

## Khi nào không nên dùng

Pessimistic Locking là lựa chọn đúng khi xung đột có khả năng cao và tính đúng đắn quan trọng hơn throughput tối đa: tồn kho, số dư, đặt chỗ. Với các luồng nặng về đọc hoặc dữ liệu ít tranh chấp, Optimistic Locking (cột version kèm UPDATE có điều kiện) tránh hẳn việc giữ khóa. Và đừng bao giờ giữ row lock trong lúc chờ con người.

## Key Takeaways

1. \`SELECT ... FOR UPDATE\` chỉ tuần tự hóa các transaction tranh nhau cùng những row đó, và khóa tồn tại đến khi COMMIT hoặc ROLLBACK.
2. Dùng NOWAIT để báo lỗi nhanh và SKIP LOCKED cho các queue worker chạy song song.
3. Đánh index cho mệnh đề WHERE, khóa nhiều row theo thứ tự nhất quán và giữ transaction ngắn.
4. Cấu hình lock, statement và idle-in-transaction timeout một cách chủ động, vì mặc định của PostgreSQL là không giới hạn.
5. Coi lỗi deadlock là lỗi có thể retry.
    `
  },
  {
    id: 9,
    slug: 'preventing-overbooking-reservation-holds-redis-ttl',
    title: "Preventing Overbooking: Reservation Holds with Redis TTL",
    category: "Full-Stack",
    difficulty: "Advanced",
    readTime: "9 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Phân tích kỹ thuật cơ chế giữ chỗ tạm thời cho ghế/vé: Redis SET NX EX để claim nguyên tử, database làm source of truth, và các trường hợp biên (late webhook, Redis restart, đặt nhiều ghế) làm hỏng những thiết kế ngây thơ.",
    tags: ["Redis", "Concurrency", "System Design", "Booking", "Lua"],
    content: `
# Preventing Overbooking: Reservation Holds with Redis TTL

Hai người dùng bấm cùng một ghế trong cùng một mili-giây. Một người phải thua, và ghế không được phép bị khóa mãi nếu người thắng bỏ đi giữa trang thanh toán. Đây là bài toán Reservation Hold, xuất hiện trong bán vé, đặt phòng khách sạn và flash sale.

## Thiết kế trong một đoạn

Database chỉ lưu các trạng thái bền vững: AVAILABLE và BOOKED. Hold tạm thời chỉ nằm trên Redis, dưới dạng một key có TTL 15 phút. Khi key hết hạn thì ghế tự động trống lại, nên không cần ghi row HOLDING và không cần Cronjob quét các hold hết hạn.

## Data model

\`\`\`sql
-- trạng thái bền vững: chỉ có hai giá trị
event_seats(event_id, seat_id, status, user_id, updated_at)
status IN ('AVAILABLE', 'BOOKED')
\`\`\`

\`\`\`
-- trạng thái tạm thời trên Redis
key:   hold:{event_id}:{seat_id}      ví dụ hold:event_1:seat_A1
value: id của user hoặc order         chủ sở hữu của hold
TTL:   900 giây
\`\`\`

## Luồng 1: liệt kê ghế khả dụng

Đọc toàn bộ ghế của event từ database, sau đó kiểm tra những ghế AVAILABLE nào đang bị giữ bằng đúng một lệnh MGET.

\`\`\`javascript
const seats = await db.query('SELECT seat_id, status FROM event_seats WHERE event_id = $1', [eventId]);
const available = seats.rows.filter(s => s.status === 'AVAILABLE');
const holds = await redis.mget(available.map(s => \`hold:\${eventId}:\${s.seat_id}\`));
\`\`\`

BOOKED trong database nghĩa là đã bán. AVAILABLE kèm key Redis nghĩa là đang được giữ. AVAILABLE mà không có key nghĩa là còn trống. Tuyệt đối không dùng KEYS cho việc này: nó quét toàn bộ keyspace và chặn Redis trong lúc chạy.

## Luồng 2: giữ một ghế

Sau bước kiểm tra nhanh ghế đang AVAILABLE trong database, claim ghế bằng một lệnh nguyên tử:

\`\`\`
SET hold:event_1:seat_A1 user_A NX EX 900
\`\`\`

NX nghĩa là "chỉ khi key chưa tồn tại" và EX đặt TTL trong cùng một bước. OK nghĩa là bạn đã giữ được ghế, hãy tạo đơn hàng PENDING. nil nghĩa là người khác nhanh hơn, hãy yêu cầu user chọn ghế khác. Đừng cài đặt bằng GET rồi SET, vì race condition sẽ quay lại ngay.

## Luồng 3: xác nhận thanh toán

Khi cổng thanh toán gọi webhook, database quyết định, không phải đồng hồ:

\`\`\`sql
UPDATE event_seats
SET status = 'BOOKED', user_id = 'user_A', updated_at = NOW()
WHERE event_id = 'event_1' AND seat_id = 'seat_A1' AND status = 'AVAILABLE';
\`\`\`

Điều kiện status chính là một Optimistic Lock. Nếu ảnh hưởng một row thì ghế là của bạn. Nếu ảnh hưởng 0 row thì người khác đã sở hữu, hãy hủy đơn và kích hoạt Auto-Refund. Chỉ sau khi database xác nhận mới nhả key Redis. Làm đúng thứ tự này thì không bao giờ có lúc hold đã mất mà ghế vẫn trông như AVAILABLE.

Nhả key bằng compare-and-delete, để không xóa nhầm hold mới hơn của người khác:

\`\`\`lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
\`\`\`

## Luồng 4: hết hạn và hủy

Nếu không ai thanh toán trong 900 giây, Redis tự xóa key và lần liệt kê ghế kế tiếp sẽ hiển thị ghế là còn trống. Nếu user chủ động hủy, chạy cùng script compare-and-delete để nhả ngay thay vì chờ hết TTL.

## Các trường hợp biên

### Late webhook

User thanh toán lúc 14:59 và ngân hàng báo về lúc 15:02, sau khi key đã hết hạn. Vì việc xác nhận dựa trên trạng thái database, đơn hàng vẫn thành công nếu trong lúc đó chưa ai mua ghế. Có một điều cần quyết định chủ động: nếu lúc đó có user khác đang giữ ghế, bạn chấp nhận người trả trễ và hoàn tiền cho người đang giữ, hay từ chối người trả trễ? Luồng trên ưu tiên bên nào chạm vào UPDATE có điều kiện trước.

### Lệch đồng hồ phía client

Bộ đếm trên app có thể chạy chậm hơn server. Hãy hiển thị bộ đếm ngắn hơn TTL khoảng 30 giây, ví dụ 14:30 trên màn hình so với 15:00 trên Redis.

### Redis restart

Redis giữ dữ liệu trên RAM nên restart sẽ làm mất mọi hold. Bật AOF với fsync mỗi giây:

\`\`\`
appendonly yes
appendfsync everysec
\`\`\`

AOF lưu thời điểm hết hạn dưới dạng timestamp tuyệt đối nên TTL còn lại được khôi phục đúng. Bạn có thể mất tối đa khoảng một giây dữ liệu ghi, và câu UPDATE có điều kiện ở database vẫn là lớp bảo vệ cuối cùng chống bán trùng.

### Đặt nhiều ghế

User chọn ba ghế nhưng chỉ giữ được hai. Dùng Lua Script để Redis kiểm tra và claim tất cả trong một bước nguyên tử:

\`\`\`lua
-- KEYS = các hold key, ARGV[1] = owner, ARGV[2] = ttl (giây)
for _, k in ipairs(KEYS) do
  if redis.call('EXISTS', k) == 1 then
    return 0
  end
end
for _, k in ipairs(KEYS) do
  redis.call('SET', k, ARGV[1], 'EX', ARGV[2])
end
return 1
\`\`\`

Script trả về 1 nếu giữ được tất cả ghế và 0 nếu không thay đổi gì.

### Redis Cluster

MGET và Lua Script nhiều key sẽ lỗi CROSSSLOT khi các key nằm ở hash slot khác nhau. Dùng hash tag như \`hold:{event_1}:seat_A1\` để mọi ghế của một event cùng một slot. Đổi lại, một event sẽ chỉ nằm trên một shard.

## Key Takeaways

1. Giữ quyền sở hữu bền vững ở database và hold tạm thời ở Redis kèm TTL, nên hết hạn không cần Cronjob.
2. Claim bằng SET NX EX, không bao giờ GET rồi SET, và liệt kê khả dụng bằng MGET, không bao giờ dùng KEYS.
3. Xác nhận thanh toán bằng UPDATE có điều kiện (WHERE status = 'AVAILABLE'), sau đó mới nhả Redis, và hoàn tiền nếu update ảnh hưởng 0 row.
4. Nhả hold bằng compare-and-delete để chỉ xóa hold của chính mình.
5. Dùng Lua Script cho hold nhiều ghế kiểu all-or-nothing, AOF everysec cho trường hợp restart, và hash tag trên Redis Cluster.
    `
  },
  {
    id: 10,
    slug: 'idempotency-key-tranh-tru-tien-2-lan',
    title: "Idempotency Key: Tránh Trừ Tiền 2 Lần",
    category: "Full-Stack",
    difficulty: "Advanced",
    readTime: "13 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Giải quyết triệt để bài toán thanh toán hai lần khi mạng chập chờn, client retry hoặc người dùng bấm lặp lại: Idempotency Key lưu cùng transaction, Payment State Machine và Reconciliation làm lưới an toàn.",
    tags: ["Idempotency", "Payment", "State Machine", "Concurrency", "System Design"],
    content: `
# Idempotency Key: Tránh Trừ Tiền 2 Lần

Người dùng bấm "Thanh toán", mạng chập chờn, app không nhận được response nên tự retry. Hoặc người dùng thấy nút đứng yên và bấm thêm lần nữa. Nếu server coi mỗi request là một ý định mới, khách bị trừ tiền hai lần. Cách xử lý triệt để là kết hợp hai thứ: Idempotency để lặp lại cùng một ý định chỉ tạo ra một tác động nghiệp vụ, và Payment State Machine để kiểm soát các bước chuyển trạng thái hợp lệ.

## 1. Thiết kế Idempotency đúng cách

### Sinh key theo ý định (Intent)

Client sinh một key duy nhất (ví dụ UUID) cho mỗi lần người dùng chủ động bấm thanh toán một đơn cụ thể, rồi gửi kèm qua header:

\`\`\`
POST /payments
Idempotency-Key: 6f1c2b7e-3a54-4d0e-9a52-0c1f5d8b7a11
\`\`\`

Quy tắc quan trọng: retry do lỗi mạng dùng lại đúng key đó, còn một lần thanh toán mới với ý định khác (đơn khác, số tiền khác) phải dùng key mới. Nếu sinh key mới cho mỗi lần retry thì idempotency không còn tác dụng.

### Lưu key trong cùng transaction với dữ liệu nghiệp vụ

Hai cách làm sai phổ biến là check-then-insert (kiểm tra key chưa có rồi mới insert, dễ dính race condition) và dual write (ghi key sang Redis, ghi đơn sang SQL, hai nơi có thể lệch nhau). Cách an toàn là lưu key ngay trong database nghiệp vụ, với ràng buộc UNIQUE, trong cùng một ACID transaction:

\`\`\`sql
CREATE TABLE idempotency_keys (
  idempotency_key   VARCHAR(64) PRIMARY KEY,   -- UNIQUE chặn race condition
  request_hash      CHAR(64)    NOT NULL,      -- hash của body request
  status            VARCHAR(16) NOT NULL,      -- IN_PROGRESS | COMPLETED
  response_snapshot JSONB,                     -- kết quả đã trả cho client
  created_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);
\`\`\`

Việc insert dựa vào ràng buộc UNIQUE thay vì kiểm tra trước:

\`\`\`sql
INSERT INTO idempotency_keys (idempotency_key, request_hash, status)
VALUES ($1, $2, 'IN_PROGRESS')
ON CONFLICT (idempotency_key) DO NOTHING;
\`\`\`

Nếu insert được 1 row, request này là request đầu tiên và được phép xử lý. Nếu 0 row, key đã tồn tại và bạn phải xem trạng thái của nó.

### Xử lý request trùng key

\`\`\`javascript
const existing = await db.findIdempotencyKey(key);

if (existing.request_hash !== requestHash) {
  return res.status(422).json({ error: 'Idempotency key reused with a different request' });
}
if (existing.status === 'IN_PROGRESS') {
  return res.status(409).json({ error: 'Request is still being processed' }); // hoặc 202
}
return res.status(200).json(existing.response_snapshot); // COMPLETED: trả lại kết quả cũ
\`\`\`

- Đang xử lý (IN_PROGRESS): trả 409 Conflict hoặc 202 Accepted để client retry sau, tuyệt đối không gọi sang cổng thanh toán lần nữa.
- Đã hoàn tất (COMPLETED): trả lại đúng kết quả đã lưu mà không trừ tiền lại.
- Cùng key nhưng khác nội dung request: trả 422, vì đó là lỗi của client chứ không phải retry hợp lệ. Đây là lý do cần lưu request_hash.

### Truyền key sang Payment Gateway

Chuyển tiếp idempotency key (hoặc một mã giao dịch nội bộ bất biến) khi gọi cổng thanh toán, và dùng event id của webhook để chống xử lý trùng. Như vậy cổng thanh toán cũng nhận ra một lệnh gọi lặp lại thay vì tạo thêm một giao dịch.

\`\`\`javascript
await gateway.charge(
  { amount, currency, orderId },
  { headers: { 'Idempotency-Key': paymentId } } // mã nội bộ bất biến
);
\`\`\`

### Đừng giữ transaction trong lúc gọi cổng thanh toán

Gọi một dịch vụ bên ngoài giữa BEGIN và COMMIT sẽ giữ lock và connection quá lâu. Chia làm hai transaction: transaction 1 insert idempotency key (IN_PROGRESS) và tạo payment ở trạng thái INITIATED rồi commit; sau đó gọi gateway; transaction 2 cập nhật trạng thái payment và đánh dấu key COMPLETED kèm response_snapshot. Nếu server sập giữa hai bước, key vẫn ở IN_PROGRESS, và phần Reconciliation bên dưới sẽ xử lý.

## 2. Quản lý trạng thái bằng State Machine

Không dùng \`is_paid = true/false\`. Một cờ boolean không phản ánh được các pha trung gian và bất đồng bộ của thanh toán. Hãy mô hình hóa bằng các trạng thái rõ ràng:

\`\`\`
INITIATED / PENDING -> PROCESSING -> SUCCEEDED
                                  -> FAILED
                                  -> EXPIRED
SUCCEEDED -> REFUNDED
\`\`\`

### Quy tắc chuyển trạng thái

Chỉ cho phép chuyển tiếp theo luật định. Ví dụ chỉ được đi từ PENDING hoặc PROCESSING sang SUCCEEDED, và không bao giờ đi từ SUCCEEDED về FAILED. Ép luật này ngay trong câu UPDATE:

\`\`\`sql
UPDATE payments
SET status = 'SUCCEEDED', updated_at = NOW()
WHERE id = $1 AND status IN ('PENDING', 'PROCESSING');
\`\`\`

Nếu câu lệnh ảnh hưởng 0 row, trạng thái đã đổi bởi bên khác, và bạn bỏ qua thay vì ghi đè. Đây là Optimistic Locking (điều kiện status trong WHERE). Nếu cần đọc trước rồi mới quyết định, dùng Pessimistic Locking với \`SELECT ... FOR UPDATE\` để khóa row. Cả hai cách đều chặn race condition giữa response đồng bộ từ cổng thanh toán và webhook bất đồng bộ đến cùng lúc, vì chỉ một bên chuyển được trạng thái.

## 3. Reconciliation làm lưới an toàn

Dù đã có Idempotency và State Machine, vẫn có hai tình huống không tránh được: gọi cổng thanh toán bị timeout (không biết tiền đã bị trừ hay chưa) và mất webhook. Cần một job định kỳ đối soát:

\`\`\`sql
SELECT id FROM payments
WHERE status IN ('PENDING', 'PROCESSING')
  AND updated_at < NOW() - INTERVAL '10 minutes';
\`\`\`

Với mỗi payment tìm được, hỏi cổng thanh toán trạng thái thật bằng mã giao dịch bất biến, rồi chuyển trạng thái qua đúng State Machine ở trên (SUCCEEDED, FAILED hoặc EXPIRED). Vì cập nhật dùng điều kiện trạng thái, việc job chạy lại hay chạy chồng với webhook đều an toàn. Ngoài ra nên đối soát hằng ngày với file settlement của cổng thanh toán để phát hiện các giao dịch lệch.

## Ví dụ triển khai đầy đủ (Node.js + PostgreSQL)

Phần dưới ghép các mảnh ở trên thành một luồng chạy được. Code dùng Express và thư viện \`pg\`. Đối tượng \`gateway\` là SDK của cổng thanh toán (giả định), bạn thay bằng SDK thật của mình.

### Bước 0: schema

\`\`\`sql
CREATE TABLE payments (
  id               BIGSERIAL PRIMARY KEY,
  order_id         VARCHAR(64) NOT NULL,
  amount           BIGINT      NOT NULL,
  status           VARCHAR(16) NOT NULL,        -- PENDING | PROCESSING | SUCCEEDED | FAILED | EXPIRED | REFUNDED
  idempotency_key  VARCHAR(64) NOT NULL UNIQUE,
  updated_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- chống xử lý trùng webhook
CREATE TABLE webhook_events (
  event_id    VARCHAR(64) PRIMARY KEY,
  received_at TIMESTAMP NOT NULL DEFAULT NOW()
);
\`\`\`

Cùng với bảng \`idempotency_keys\` ở phần 1.

### Bước 1: client giữ key khi retry

Sinh key một lần khi người dùng bấm nút, rồi dùng lại đúng key đó cho mọi lần retry của lần bấm này. Nên vô hiệu hóa nút trong lúc đang gửi để giảm bấm lặp.

\`\`\`javascript
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pay(orderId, amount) {
  const idempotencyKey = crypto.randomUUID(); // sinh MỘT LẦN cho ý định này

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ orderId, amount }),
      });
      if (res.status === 409 || res.status === 202) {
        await sleep(1000 * attempt); // server đang xử lý, chờ rồi hỏi lại
        continue;
      }
      return await res.json();
    } catch (err) {
      await sleep(1000 * attempt); // lỗi mạng: retry với CÙNG key
    }
  }
  throw new Error('Payment status unknown, please check your order');
}
\`\`\`

### Bước 2: endpoint tạo thanh toán

\`\`\`javascript
import crypto from 'node:crypto';

const hashBody = (body) =>
  crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');

// UPDATE có điều kiện: chỉ chuyển trạng thái khi đang ở trạng thái hợp lệ
async function transition(paymentId, fromStates, toState) {
  const r = await pool.query(
    \`UPDATE payments SET status = $2, updated_at = NOW()
     WHERE id = $1 AND status = ANY($3)\`,
    [paymentId, toState, fromStates]
  );
  return r.rowCount === 1; // false = bên khác đã đổi trạng thái trước
}

app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header is required' });

  const { orderId, amount } = req.body; // thực tế: validate bằng schema (zod, joi...)
  const requestHash = hashBody({ orderId, amount });

  // ---- Transaction 1: giành quyền xử lý key + tạo payment ----
  const client = await pool.connect();
  let paymentId;
  try {
    await client.query('BEGIN');
    const claimed = await client.query(
      \`INSERT INTO idempotency_keys (idempotency_key, request_hash, status)
       VALUES ($1, $2, 'IN_PROGRESS')
       ON CONFLICT (idempotency_key) DO NOTHING\`,
      [key, requestHash]
    );

    if (claimed.rowCount === 0) {
      await client.query('ROLLBACK');
      const { rows } = await pool.query(
        'SELECT request_hash, status, response_snapshot FROM idempotency_keys WHERE idempotency_key = $1',
        [key]
      );
      const existing = rows[0];
      if (existing.request_hash !== requestHash) {
        return res.status(422).json({ error: 'Idempotency key reused with a different request' });
      }
      if (existing.status === 'IN_PROGRESS') {
        return res.status(409).json({ error: 'Request is still being processed' });
      }
      return res.status(200).json(existing.response_snapshot); // replay kết quả cũ
    }

    const created = await client.query(
      \`INSERT INTO payments (order_id, amount, status, idempotency_key)
       VALUES ($1, $2, 'PROCESSING', $3) RETURNING id\`,
      [orderId, amount, key]
    );
    paymentId = created.rows[0].id;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // ---- Gọi cổng thanh toán NGOÀI transaction, kèm mã bất biến ----
  let charge;
  try {
    charge = await gateway.charge({ amount, orderId }, { idempotencyKey: String(paymentId) });
  } catch (err) {
    // Timeout: không biết tiền đã bị trừ chưa. Giữ nguyên PROCESSING,
    // job reconcile sẽ hỏi lại cổng thanh toán.
    return res.status(202).json({ paymentId, status: 'PROCESSING' });
  }

  // ---- Transaction 2: chốt trạng thái và lưu response ----
  await transition(paymentId, ['PROCESSING'], charge.ok ? 'SUCCEEDED' : 'FAILED');
  const body = { paymentId, status: charge.ok ? 'SUCCEEDED' : 'FAILED' };
  await pool.query(
    \`UPDATE idempotency_keys SET status = 'COMPLETED', response_snapshot = $2
     WHERE idempotency_key = $1\`,
    [key, body]
  );
  return res.status(200).json(body);
});
\`\`\`

Để ý hai điểm: \`transition()\` chỉ thành công khi payment đang ở trạng thái cho phép, nên nếu webhook đã chốt trước đó thì lần chốt này không ghi đè; và nhánh timeout trả 202 chứ không báo lỗi, vì tiền có thể đã bị trừ.

### Bước 3: webhook idempotent

\`\`\`javascript
app.post('/webhooks/payment', async (req, res) => {
  // 1) Bắt buộc verify chữ ký HMAC của cổng thanh toán trước khi tin payload (bỏ qua ở đây cho ngắn)
  const { eventId, paymentId, outcome } = req.body;

  // 2) Chống xử lý trùng: event đã thấy rồi thì bỏ qua
  const seen = await pool.query(
    'INSERT INTO webhook_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING',
    [eventId]
  );
  if (seen.rowCount === 0) return res.sendStatus(200);

  // 3) Chuyển trạng thái theo State Machine
  await transition(paymentId, ['PENDING', 'PROCESSING'], outcome === 'paid' ? 'SUCCEEDED' : 'FAILED');
  return res.sendStatus(200);
});
\`\`\`

Nếu server sập giữa bước 2 và 3, event đã được ghi nhận nhưng trạng thái chưa đổi. Trường hợp này job reconcile bên dưới sẽ bù lại.

### Bước 4: job reconcile

\`\`\`javascript
async function reconcile() {
  const { rows } = await pool.query(
    \`SELECT id, idempotency_key FROM payments
     WHERE status IN ('PENDING', 'PROCESSING')
       AND updated_at < NOW() - INTERVAL '10 minutes'
     LIMIT 100\`
  );

  for (const { id, idempotency_key } of rows) {
    const remote = await gateway.getCharge(String(id)); // tra theo mã bất biến
    if (remote.status === 'pending') continue;          // cổng vẫn đang xử lý, để lần sau

    const to = remote.status === 'paid' ? 'SUCCEEDED'
             : remote.status === 'failed' ? 'FAILED'
             : 'EXPIRED';
    await transition(id, ['PENDING', 'PROCESSING'], to);

    // giải phóng idempotency key đang kẹt IN_PROGRESS
    await pool.query(
      \`UPDATE idempotency_keys SET status = 'COMPLETED', response_snapshot = $2
       WHERE idempotency_key = $1 AND status = 'IN_PROGRESS'\`,
      [idempotency_key, { paymentId: id, status: to }]
    );
  }
}

setInterval(() => reconcile().catch(console.error), 60_000); // hoặc cron / scheduler của bạn
\`\`\`

Vì \`transition()\` có điều kiện trạng thái, job này an toàn khi chạy lặp hoặc chạy chồng với webhook. Nếu chạy nhiều instance, hãy thêm \`FOR UPDATE SKIP LOCKED\` vào câu SELECT để mỗi instance lấy các payment khác nhau.

### Kiểm tra nhanh bằng curl

\`\`\`bash
# gửi hai lần cùng key: lần 2 phải trả đúng kết quả cũ, không tạo payment mới
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":150000}'
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":150000}'

# cùng key nhưng khác nội dung: phải trả 422
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":999999}'
\`\`\`

## Lưu ý vận hành

1. Đặt thời hạn cho idempotency key (ví dụ 24 giờ) và dọn các key cũ, nếu không bảng sẽ phình mãi.
2. Key IN_PROGRESS bị kẹt do server sập cần có cách giải phóng, thường là qua job Reconciliation hoặc một timeout trên created_at.
3. Webhook cũng phải idempotent: lưu event id đã xử lý, vì cổng thanh toán thường gửi lại webhook nhiều lần.

## Key Takeaways

1. Client sinh một Idempotency Key cho mỗi ý định thanh toán và dùng lại đúng key đó khi retry.
2. Lưu key kèm request_hash, status và response_snapshot trong cùng database và cùng transaction với dữ liệu nghiệp vụ, dùng UNIQUE thay vì check-then-insert.
3. Trùng key khi đang xử lý trả 409 hoặc 202, đã hoàn tất trả lại kết quả cũ, khác nội dung request trả 422.
4. Truyền key sang Payment Gateway và chống trùng webhook bằng event id.
5. Dùng State Machine với UPDATE có điều kiện status thay cho cờ boolean, và đừng giữ transaction trong lúc gọi dịch vụ bên ngoài.
6. Reconciliation là lưới an toàn cho timeout và webhook bị mất.
    `
  },
  {
    id: 11,
    slug: 'kiem-tra-trung-lich-overlap-detection-booking',
    title: "Kiểm Tra Trùng Lịch (Overlap Detection) trong Hệ Thống Booking",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "11 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Công thức kiểm tra trùng lịch chỉ với hai phép so sánh, cách đưa vào SQL, các trường hợp biên (validation, reschedule, timezone, buffer time) và cách chặn race condition tận gốc bằng EXCLUDE constraint của PostgreSQL.",
    tags: ["Booking", "SQL", "PostgreSQL", "Concurrency", "Algorithm"],
    content: `
# Kiểm Tra Trùng Lịch (Overlap Detection) trong Hệ Thống Booking

Đặt phòng họp, lịch khám, thuê xe: bài toán nào cũng có một câu hỏi chung: khung giờ mới có đè lên lịch đã có không? Công thức rất ngắn, nhưng đưa vào hệ thống thật thì có nhiều chỗ dễ sai. Bài này đi từ công thức cơ bản đến cách triển khai an toàn với schema và SQL mẫu.

## 1. Công thức cơ bản

Hai khoảng thời gian \`[newStart, newEnd)\` và \`[existingStart, existingEnd)\` trùng nhau khi và chỉ khi:

\`\`\`
newStart < existingEnd  AND  newEnd > existingStart
\`\`\`

Hiểu theo cách ngược lại: chúng KHÔNG trùng khi cái này kết thúc trước hoặc đúng lúc cái kia bắt đầu. Nên chỉ cần phủ định hai trường hợp đó là xong, không cần liệt kê từng kiểu chồng lấn (nằm trong, bao trùm, lệch trái, lệch phải).

Dạng code:

\`\`\`javascript
const isOverlapping = (newStart, newEnd, existingStart, existingEnd) =>
  newStart < existingEnd && newEnd > existingStart;
\`\`\`

### Quy ước khoảng nửa mở [start, end)

Lịch 09:00 đến 10:00 và lịch 10:00 đến 11:00 nên được phép đặt liền nhau. Dùng dấu \`<\` và \`>\` (không phải \`<=\` và \`>=\`) chính là quy ước khoảng nửa mở: thời điểm bắt đầu được tính, thời điểm kết thúc không được tính. Hãy thống nhất quy ước này ở mọi tầng (frontend, backend, database).

Giả sử đã có một lịch 09:00 đến 10:00, các trường hợp cần test:

\`\`\`
Lịch mới        Kết quả   Lý do
10:00 - 11:00   OK        đặt liền sau, end == start nên không trùng
08:00 - 09:00   OK        đặt liền trước
08:00 - 08:30   OK        nằm hẳn phía trước
09:30 - 10:30   TRÙNG     lệch phải
08:30 - 09:30   TRÙNG     lệch trái
09:15 - 09:45   TRÙNG     nằm trong lịch cũ
08:00 - 11:00   TRÙNG     bao trùm lịch cũ
09:00 - 10:00   TRÙNG     trùng khớp hoàn toàn
\`\`\`

## 2. Schema mẫu

Ví dụ với PostgreSQL:

\`\`\`sql
CREATE TABLE resources (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL            -- phòng họp, bác sĩ, xe...
);

CREATE TABLE bookings (
  id          BIGSERIAL PRIMARY KEY,
  resource_id BIGINT      NOT NULL REFERENCES resources(id),
  user_id     BIGINT      NOT NULL,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  status      VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',  -- CONFIRMED | CANCELLED
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_booking_time CHECK (start_time < end_time)
);

-- index phục vụ câu truy vấn kiểm tra trùng
CREATE INDEX idx_bookings_resource_time
  ON bookings (resource_id, start_time, end_time)
  WHERE status <> 'CANCELLED';
\`\`\`

Một vài điểm đáng chú ý:
- Dùng \`TIMESTAMPTZ\` thay vì \`TIMESTAMP\` để tránh sai lệch múi giờ. Lưu theo UTC, chỉ đổi sang giờ địa phương khi hiển thị.
- \`CHECK (start_time < end_time)\` là lớp bảo vệ cuối cho điều kiện hợp lệ của đầu vào, kể cả khi code ứng dụng quên kiểm tra.
- Index một phần (\`WHERE status <> 'CANCELLED'\`) bỏ qua các lịch đã hủy, nhỏ hơn và nhanh hơn.

Dữ liệu mẫu:

\`\`\`sql
INSERT INTO resources (name) VALUES ('Meeting Room A');

INSERT INTO bookings (resource_id, user_id, start_time, end_time) VALUES
  (1, 101, '2026-12-01 09:00:00+07', '2026-12-01 10:00:00+07'),
  (1, 102, '2026-12-01 13:00:00+07', '2026-12-01 14:30:00+07');
\`\`\`

## 3. Kiểm tra trùng lịch bằng SQL

Đừng kéo toàn bộ lịch về rồi lặp trong code. Hãy để database lọc trực tiếp, nhanh hơn và tốn ít bộ nhớ hơn:

\`\`\`sql
SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND status <> 'CANCELLED'              -- bỏ qua lịch đã hủy
    AND start_time < '2026-12-01 10:30:00+07'   -- newEnd
    AND end_time   > '2026-12-01 09:30:00+07'   -- newStart
) AS is_overlapping;
\`\`\`

Kết quả \`true\` nghĩa là bị trùng, \`false\` nghĩa là khung giờ còn trống. Dùng \`EXISTS\` thay cho \`COUNT(*)\` vì database dừng ngay khi gặp row đầu tiên thay vì đếm hết.

Với dữ liệu mẫu ở trên, khung 09:30 đến 10:30 trả về \`true\` (đè lên lịch 09:00 đến 10:00), còn khung 10:00 đến 11:00 trả về \`false\`.

Để xem các lịch đang gây trùng (hữu ích khi báo lỗi cho người dùng):

\`\`\`sql
SELECT id, start_time, end_time
FROM bookings
WHERE resource_id = 1
  AND status <> 'CANCELLED'
  AND start_time < '2026-12-01 10:30:00+07'
  AND end_time   > '2026-12-01 09:30:00+07'
ORDER BY start_time;
\`\`\`

## 4. Các trường hợp biên

### Kiểm tra đầu vào

Luôn kiểm tra \`newStart < newEnd\` trước khi chạy truy vấn. Nếu thời gian bắt đầu lớn hơn hoặc bằng thời gian kết thúc, trả lỗi ngay. Kèm theo đó nên kiểm tra các giới hạn nghiệp vụ như không đặt vào quá khứ hay không dài quá mức cho phép.

\`\`\`javascript
if (!(newStart < newEnd)) {
  throw new Error('start_time must be before end_time');
}
\`\`\`

### Cập nhật hoặc đổi lịch (Reschedule)

Khi sửa một lịch đã có, phải loại chính nó ra khỏi phép so sánh. Nếu không, lịch mới sẽ báo trùng với chính phiên bản cũ của nó.

\`\`\`sql
SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND id <> 42                            -- loại trừ chính lịch đang sửa
    AND status <> 'CANCELLED'
    AND start_time < '2026-12-01 11:00:00+07'
    AND end_time   > '2026-12-01 10:00:00+07'
) AS is_overlapping;
\`\`\`

### Thời gian nghỉ (Buffer Time)

Phòng họp cần dọn dẹp, bác sĩ cần nghỉ giữa ca, xe thuê cần vệ sinh. Với \`buffer\` phút, cộng khoảng đó vào lúc kiểm tra:

\`\`\`javascript
const isOverlapping = (newStart, newEnd, existingStart, existingEnd, bufferMs) =>
  newStart < existingEnd + bufferMs && newEnd + bufferMs > existingStart;
\`\`\`

Tương đương trong SQL, với buffer 15 phút:

\`\`\`sql
SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND status <> 'CANCELLED'
    AND start_time < '2026-12-01 10:30:00+07'::timestamptz + INTERVAL '15 minutes'
    AND end_time   > '2026-12-01 09:30:00+07'::timestamptz - INTERVAL '15 minutes'
) AS is_overlapping;
\`\`\`

Lưu ý hệ quả: khi có buffer, lịch 10:00 đến 11:00 đặt liền sau lịch 09:00 đến 10:00 cũng bị coi là trùng (kết quả \`true\`), vì giữa hai ca phải cách nhau ít nhất 15 phút. Đó là ý định của buffer, nhưng hãy nhớ báo rõ lý do cho người dùng.

Một giới hạn quan trọng: EXCLUDE constraint ở phần 5 chỉ so sánh \`[start_time, end_time)\` gốc, nên không tự áp dụng buffer. Nếu cần database cưỡng chế cả buffer, hãy lưu thêm hai cột \`block_start = start_time - buffer\` và \`block_end = end_time + buffer\` (do ứng dụng tính khi ghi) rồi đặt EXCLUDE trên khoảng \`[block_start, block_end)\`. Không đặt trực tiếp biểu thức \`start_time - INTERVAL '15 minutes'\` vào constraint vì PostgreSQL không coi phép cộng/trừ interval trên \`timestamptz\` là immutable.

## 5. Race condition: bước kiểm tra là chưa đủ

Hai người cùng bấm đặt khung giờ 09:30 đến 10:30 tại cùng một mili-giây. Cả hai chạy câu SELECT ở trên, cả hai nhận \`false\`, cả hai INSERT. Kết quả: hai lịch đè nhau. Kiểm tra rồi mới ghi (check-then-insert) không bao giờ an toàn khi có đồng thời.

### Cách 1 (khuyến nghị cho PostgreSQL): EXCLUDE constraint

Để chính database từ chối lịch trùng, không phụ thuộc vào code ứng dụng:

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  ) WHERE (status <> 'CANCELLED');
\`\`\`

Ý nghĩa: không được tồn tại hai row cùng \`resource_id\` mà khoảng thời gian \`[start, end)\` chồng lên nhau (toán tử \`&&\`), và chỉ áp dụng cho các lịch chưa hủy. Khi đó chỉ cần INSERT và bắt lỗi:

\`\`\`javascript
try {
  await pool.query(
    \`INSERT INTO bookings (resource_id, user_id, start_time, end_time)
     VALUES ($1, $2, $3, $4)\`,
    [resourceId, userId, newStart, newEnd]
  );
} catch (err) {
  if (err.code === '23P01') {            // exclusion_violation
    return res.status(409).json({ error: 'Time slot is already booked' });
  }
  throw err;
}
\`\`\`

Lúc này câu SELECT kiểm tra trùng chỉ còn để phản hồi sớm cho người dùng, còn tính đúng đắn do constraint đảm bảo. Lưu ý \`'[)'\` khớp với quy ước nửa mở ở phần 1, nên lịch 09:00 đến 10:00 và 10:00 đến 11:00 vẫn đặt liền được.

### Cách 2 (MySQL hoặc DB không có EXCLUDE): khóa row cha trong transaction

Bảng bookings không có row nào để khóa trong khoảng trống chưa ai đặt, nên hãy khóa row của tài nguyên (resource) để tuần tự hóa các lần đặt cùng tài nguyên:

\`\`\`sql
BEGIN;
SELECT id FROM resources WHERE id = 1 FOR UPDATE;   -- người đến sau chờ ở đây

-- kiểm tra trùng (câu SELECT EXISTS ở phần 3)
-- nếu is_overlapping = false thì:
INSERT INTO bookings (resource_id, user_id, start_time, end_time)
VALUES (1, 101, '2026-12-01 09:30:00+07', '2026-12-01 10:30:00+07');
COMMIT;
\`\`\`

Nhược điểm: các lần đặt cùng một tài nguyên bị xếp hàng (khác ngày vẫn chờ nhau). Với lưu lượng đặt vừa phải thì chấp nhận được; hãy giữ transaction ngắn và đặt lock timeout.

## 6. So sánh nhanh

\`\`\`
Cách                         Chặn race condition   Độ phức tạp   Ghi chú
Chỉ SELECT rồi INSERT        Không                 Thấp          Chỉ dùng cho demo
Khóa row resource            Có                    Trung bình    Chạy được trên mọi DB, đặt chung hàng chờ
EXCLUDE constraint (PG)      Có                    Thấp          Gọn nhất, DB tự bảo vệ, cần btree_gist
\`\`\`

## Key Takeaways

1. Công thức trùng lịch: \`newStart < existingEnd AND newEnd > existingStart\`, dùng khoảng nửa mở để các lịch liền kề không bị coi là trùng.
2. Để database lọc bằng \`EXISTS\` kèm index \`(resource_id, start_time, end_time)\`, đừng kéo dữ liệu về lặp trong code.
3. Kiểm tra \`start < end\`, loại trừ chính lịch đang sửa khi reschedule, bỏ qua lịch đã hủy, và lưu giờ bằng \`TIMESTAMPTZ\`.
4. Buffer time chỉ là cộng thêm khoảng nghỉ vào hai vế so sánh.
5. Check-then-insert không an toàn khi đồng thời: dùng EXCLUDE constraint trên PostgreSQL, hoặc khóa row resource trong transaction trên các DB khác.
    `
  }
];

export const getBlogPostBySlug = (slug: string | undefined): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

/** Legacy URLs were /blog/{numeric id}; used to redirect old links to the slug URL. */
export const getBlogPostById = (id: string | undefined): BlogPost | undefined =>
  blogPosts.find((post) => String(post.id) === id);
