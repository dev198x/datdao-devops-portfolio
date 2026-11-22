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
    title: "Infrastructure as Code: Best Practices khi dùng Terraform trên AWS",
    category: "Cloud Infrastructure",
    difficulty: "Advanced",
    readTime: "12 min read",
    date: "2025-01-10",
    featured: false,
    excerpt: "Quản lý hạ tầng AWS bằng Terraform với các pattern đã được kiểm chứng: cấu trúc project, remote state và state locking, bảo mật, và module tái sử dụng.",
    tags: ["Terraform", "AWS", "IaC", "Security", "Best Practices"],
    content: `
# Infrastructure as Code: Best Practices khi dùng Terraform trên AWS

Terraform đã thay đổi cách chúng ta quản lý hạ tầng. Bài này tóm tắt các best practice cốt lõi khi quản lý tài nguyên AWS bằng Terraform.

## Cấu trúc project

Tổ chức code Terraform sao cho dễ bảo trì và dễ tái sử dụng:

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

Mỗi thư mục trong \`modules/\` là một khối hạ tầng dùng lại được. Mỗi thư mục trong \`environments/\` gọi các module đó với giá trị riêng của môi trường, nên dev, staging và prod có cùng hình dạng nhưng khác cấu hình.

## State Management

Dùng remote state để cả team cùng chia sẻ một state, thay vì mỗi người giữ một file trên máy:

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

Bucket S3 chứa file state, còn bảng DynamoDB làm state lock: khi một người đang chạy \`terraform apply\`, người khác phải chờ, tránh hai lệnh cùng ghi đè state. Terraform 1.10 trở lên cũng hỗ trợ khóa ngay trên S3 bằng \`use_lockfile = true\`, không cần bảng DynamoDB nữa. File state có thể chứa dữ liệu nhạy cảm, nên hãy bật encryption, bật versioning và giới hạn quyền truy cập bucket.

## Security Best Practices

1. Dùng các AWS account riêng cho từng môi trường.
2. Áp dụng IAM policy theo nguyên tắc least privilege.
3. Bật encryption at rest và in transit.
4. Không ghi dữ liệu nhạy cảm vào code. Dùng Terraform variable (đánh dấu \`sensitive = true\`) hoặc lấy từ secret manager.
5. Mã hóa state.

## Module Reusability

Tạo các module dùng lại được, chia sẻ giữa nhiều project:

\`\`\`hcl
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  region      = var.region
  
  cidr_block = "10.0.0.0/16"
}
\`\`\`

## Kết luận

Áp dụng các best practice này giúp bạn duy trì hạ tầng Terraform có khả năng mở rộng, an toàn và dễ bảo trì.
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

## BEGIN và FOR UPDATE: hai thứ khác nhau

Hai thứ này hay bị nhầm là một. \`BEGIN\` ... \`COMMIT\` tạo ra một "khối giao dịch" để gom nhiều lệnh chạy cùng nhau. \`SELECT ... FOR UPDATE\` là lệnh khóa dòng nằm bên trong khối đó.

\`\`\`
Tiêu chí              BEGIN ... COMMIT                         SELECT ... FOR UPDATE
Bản chất              Ranh giới giao dịch: tất cả cùng         Khóa độc quyền (row-level lock) lên
                      thành công hoặc cùng hủy (Atomicity)     các dòng vừa đọc
Phạm vi               Bao toàn bộ quá trình xử lý              Phải nằm trong BEGIN ... COMMIT, nếu chạy
                                                               lẻ thì khóa nhả ngay khi lệnh xong
Tác động lên          Không khóa dòng nào cho đến khi          Chặn ngay UPDATE, DELETE, FOR UPDATE của
transaction khác      có UPDATE, DELETE hoặc FOR UPDATE        transaction khác trên cùng dòng
Rủi ro                BEGIN + SELECT thường rồi mới UPDATE:    Giữ khóa quá lâu gây chờ (lock contention),
                      hai người cùng rút tiền có thể làm       khóa nhiều dòng sai thứ tự gây deadlock
                      âm tài khoản (race condition)
\`\`\`

Nhớ ngắn gọn: \`BEGIN\` bảo đảm "làm hết hoặc không làm gì". \`FOR UPDATE\` bảo đảm "trong lúc tôi tính toán, không ai sửa dòng này". Transaction một mình không chặn được người khác.

### Khi nào chỉ cần BEGIN ... COMMIT

Khi cần toàn vẹn nhiều bước, nhưng không có chuyện đọc một giá trị rồi dựa vào nó để quyết định ghi:

\`\`\`sql
-- Tạo dữ liệu liên quan: cùng thành công hoặc cùng hủy
BEGIN;
INSERT INTO orders (id, user_id) VALUES (1, 42);
INSERT INTO order_items (order_id, sku, qty) VALUES (1, 'A01', 2);
COMMIT;

-- Cập nhật độc lập: UPDATE tự khóa dòng, không cần FOR UPDATE trước
UPDATE accounts SET balance = balance + 100 WHERE id = 100;
\`\`\`

Một trường hợp nữa là đọc báo cáo nhất quán từ nhiều bảng cùng một thời điểm, dùng \`BEGIN ISOLATION LEVEL REPEATABLE READ\`.

### Khi nào cần thêm FOR UPDATE

Khi quy trình có dạng đọc lên ứng dụng, kiểm tra điều kiện, rồi ghi xuống (Read-Modify-Write) và nhiều người cùng tranh một dòng: trừ tiền, giữ chỗ, trừ tồn kho, mã giảm giá giới hạn lượt dùng.

\`\`\`sql
-- Sai: hai giao dịch cùng thấy 500000 rồi cùng trừ, tài khoản bị âm
BEGIN;
SELECT balance FROM accounts WHERE id = 1;
-- app kiểm tra: balance >= 500000
UPDATE accounts SET balance = balance - 500000 WHERE id = 1;
COMMIT;

-- Đúng: giao dịch thứ hai phải chờ ở dòng SELECT
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- app kiểm tra: balance >= 500000
UPDATE accounts SET balance = balance - 500000 WHERE id = 1;
COMMIT;
\`\`\`

Nếu điều kiện gói được vào chính câu \`UPDATE\`, một lệnh là đủ và không cần \`FOR UPDATE\`:

\`\`\`sql
UPDATE accounts SET balance = balance - 500000
WHERE id = 1 AND balance >= 500000;   -- 0 dòng bị ảnh hưởng = không đủ tiền
\`\`\`

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
6. \`BEGIN\` chỉ gom lệnh, còn \`FOR UPDATE\` mới chặn người khác. Nếu gói được điều kiện vào \`UPDATE ... WHERE\` thì không cần \`FOR UPDATE\`.
    `
  },
  {
    id: 9,
    slug: 'preventing-overbooking-reservation-holds-redis-ttl',
    title: "Chống Overbooking cho Booking: Reservation và Pending State, từ giải pháp chuẩn đến tăng tốc bằng Redis",
    category: "Full-Stack",
    difficulty: "Advanced",
    readTime: "11 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Hai người bấm cùng một ghế cùng lúc thì ai được? Giải pháp chuẩn dùng Pending State trong database với ba bước ngắn, và giải pháp tăng tốc dùng Redis SET NX EX khi tải tranh chấp lớn. Kèm so sánh và các trường hợp biên.",
    tags: ["Redis", "PostgreSQL", "Concurrency", "System Design", "Booking", "Lua"],
    content: `
# Chống Overbooking: Reservation và Pending State

Hai người dùng bấm cùng một ghế trong cùng một mili-giây. Một người phải thua, và ghế không được phép bị khóa mãi nếu người thắng bỏ đi giữa trang thanh toán. Đây là bài toán giữ chỗ tạm thời (Reservation Hold), xuất hiện trong bán vé, đặt phòng khách sạn và flash sale.

Nguyên tắc chung cho cả hai giải pháp dưới đây: không bao giờ giữ DB transaction trong lúc chờ thanh toán qua mạng. Chỗ được giữ bằng một trạng thái tạm có hạn dùng, không phải bằng một khóa đang mở.

## Hai giải pháp trong một nhìn

\`\`\`
                      Giải pháp 1 (chuẩn)              Giải pháp 2 (tăng tốc)
Nơi giữ chỗ           Cột status = 'pending' trong DB  Key trên Redis có TTL
Hết hạn bằng          Cột expired_at + worker          Redis tự xóa key
Thành phần            Chỉ database                     Database + Redis
Dùng khi              Phần lớn hệ thống                Rất nhiều người tranh cùng lúc
\`\`\`

Hãy bắt đầu với giải pháp 1. Chỉ chuyển sang giải pháp 2 khi database thật sự quá tải.

# Giải pháp 1 (chuẩn): Pending State trong database

Tách quá trình thành ba bước độc lập.

## Bước 1: giữ chỗ nhanh (transaction ngắn, dưới 50ms)

\`\`\`sql
BEGIN;
SELECT status FROM event_seats
WHERE event_id = 'event_1' AND seat_id = 'seat_A1' FOR UPDATE;
-- app kiểm tra: status = 'available'
UPDATE event_seats
SET status = 'pending', user_id = 'user_A',
    expired_at = NOW() + INTERVAL '10 minutes'
WHERE event_id = 'event_1' AND seat_id = 'seat_A1';
COMMIT;   -- nhả khóa và kết nối ngay
\`\`\`

\`FOR UPDATE\` làm người đến sau phải chờ vài chục mili-giây, rồi thấy status đã là \`pending\` và dừng lại.

## Bước 2: gọi cổng thanh toán (không mở DB transaction)

Gọi API thanh toán hoặc cho khách quét mã QR. Lúc này database rảnh, không giữ khóa hay kết nối nào.

## Bước 3: chốt đơn hoặc nhả chỗ (transaction ngắn, dưới 50ms)

\`\`\`sql
-- Thanh toán thành công (API response hoặc webhook): mở transaction mới
UPDATE event_seats
SET status = 'booked', payment_transaction_id = 'pay_123'
WHERE event_id = 'event_1' AND seat_id = 'seat_A1'
  AND status = 'pending' AND user_id = 'user_A';

-- Thất bại hoặc quá hạn: trả chỗ lại, thường do worker chạy mỗi phút
UPDATE event_seats
SET status = 'available', user_id = NULL, expired_at = NULL
WHERE status = 'pending' AND expired_at < NOW();
\`\`\`

Hai chi tiết quan trọng:

1. Đặt \`UNIQUE\` trên \`payment_transaction_id\` để webhook gọi lặp không xử lý hai lần (idempotency).
2. Nếu UPDATE chốt đơn ảnh hưởng 0 row (chỗ đã hết hạn và bị người khác lấy), phải hoàn tiền cho khách.

## Gọn hơn: một câu UPDATE cho bước 1

Gói điều kiện vào một câu UPDATE và coi chỗ pending đã quá hạn là chỗ trống, nên không phụ thuộc vào việc worker nhả chỗ chạy kịp:

\`\`\`sql
UPDATE event_seats
SET status = 'pending', user_id = 'user_A',
    expired_at = NOW() + INTERVAL '10 minutes'
WHERE event_id = 'event_1' AND seat_id = 'seat_A1'
  AND (status = 'available' OR (status = 'pending' AND expired_at < NOW()));
-- 1 dòng = giữ được, 0 dòng = người khác đang giữ hoặc đã mua
\`\`\`

Cách này không cần \`FOR UPDATE\` vì UPDATE đã tự khóa dòng.

## Giới hạn của giải pháp 1

Mỗi lần giữ và nhả là một lần ghi vào database, và worker quét \`expired_at\` cần index. Với lượng người tranh cùng một ghế ở mức vừa thì không sao. Khi flash sale khiến hàng chục nghìn request dồn vào cùng vài dòng, database trở thành điểm nghẽn, và đó là lúc cân nhắc giải pháp 2.

# Giải pháp 2 (tăng tốc): Hold trên Redis với TTL

Database chỉ lưu các trạng thái bền vững: available và booked. Hold tạm thời nằm trên Redis dưới dạng một key có TTL. Khi key hết hạn thì ghế tự trống lại, nên không có row pending và không cần worker quét.

## Data model

\`\`\`sql
-- trạng thái bền vững: chỉ có hai giá trị
event_seats(event_id, seat_id, status, user_id, updated_at)
status IN ('available', 'booked')
\`\`\`

\`\`\`
-- trạng thái tạm thời trên Redis
key:   hold:{event_id}:{seat_id}      ví dụ hold:event_1:seat_A1
value: id của user hoặc order         chủ sở hữu của hold
TTL:   900 giây
\`\`\`

## Liệt kê ghế khả dụng

Đọc ghế của event từ database, sau đó kiểm tra những ghế available nào đang bị giữ bằng đúng một lệnh MGET.

\`\`\`javascript
const seats = await db.query('SELECT seat_id, status FROM event_seats WHERE event_id = $1', [eventId]);
const available = seats.rows.filter(s => s.status === 'available');
const holds = await redis.mget(available.map(s => \`hold:\${eventId}:\${s.seat_id}\`));
\`\`\`

booked trong database nghĩa là đã bán. available kèm key Redis nghĩa là đang được giữ. available mà không có key nghĩa là còn trống. Tuyệt đối không dùng KEYS cho việc này: nó quét toàn bộ keyspace và chặn Redis trong lúc chạy.

## Giữ một ghế

Claim ghế bằng một lệnh nguyên tử:

\`\`\`
SET hold:event_1:seat_A1 user_A NX EX 900
\`\`\`

NX nghĩa là "chỉ khi key chưa tồn tại" và EX đặt TTL trong cùng một bước. OK nghĩa là bạn đã giữ được ghế, hãy tạo đơn hàng pending. nil nghĩa là người khác nhanh hơn, hãy yêu cầu user chọn ghế khác. Đừng cài đặt bằng GET rồi SET, vì race condition sẽ quay lại ngay.

## Xác nhận thanh toán

Khi cổng thanh toán gọi webhook, database quyết định, không phải đồng hồ:

\`\`\`sql
UPDATE event_seats
SET status = 'booked', user_id = 'user_A', updated_at = NOW()
WHERE event_id = 'event_1' AND seat_id = 'seat_A1' AND status = 'available';
\`\`\`

Điều kiện status chính là một Optimistic Lock. Nếu ảnh hưởng một row thì ghế là của bạn. Nếu ảnh hưởng 0 row thì người khác đã sở hữu, hãy hủy đơn và hoàn tiền. Chỉ sau khi database xác nhận mới nhả key Redis. Làm đúng thứ tự này thì không bao giờ có lúc hold đã mất mà ghế vẫn trông như available.

Nhả key bằng compare-and-delete, để không xóa nhầm hold mới hơn của người khác:

\`\`\`lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
\`\`\`

## Hết hạn và hủy

Nếu không ai thanh toán trong 900 giây, Redis tự xóa key và lần liệt kê ghế kế tiếp sẽ hiển thị ghế là còn trống. Nếu user chủ động hủy, chạy cùng script compare-and-delete để nhả ngay thay vì chờ hết TTL.

## Trường hợp biên riêng của Redis

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

# Trường hợp biên chung cho cả hai giải pháp

## Late webhook

User thanh toán lúc 14:59 và ngân hàng báo về lúc 15:02, sau khi hold đã hết hạn. Vì việc chốt đơn dựa trên UPDATE có điều kiện ở database, đơn vẫn thành công nếu trong lúc đó chưa ai lấy ghế. Nếu đã có người khác lấy, UPDATE ảnh hưởng 0 row và bạn hoàn tiền cho người trả trễ. Hãy quyết định chính sách này từ đầu: ai chạm vào UPDATE có điều kiện trước thì thắng.

## Lệch đồng hồ phía client

Bộ đếm trên app có thể chạy chậm hơn server. Hãy hiển thị bộ đếm ngắn hơn thời hạn thật khoảng 30 giây, ví dụ 9:30 trên màn hình so với 10:00 ở server.

# So sánh và cách chọn

\`\`\`
Tiêu chí              Giải pháp 1: Pending trong DB         Giải pháp 2: Redis TTL
Hết hạn               Cần worker hoặc điều kiện expired_at  Redis tự xóa key, không cần worker
Thành phần thêm       Không cần gì thêm                     Cần Redis, AOF, xử lý Cluster
Tải lên database      Mỗi lần giữ và nhả là một lần ghi     Hold không ghi vào DB
Nguồn sự thật         Một nơi (DB), đơn giản hơn            Hai nơi (Redis và DB), dễ lệch
Phù hợp               Quy mô vừa, muốn ít thành phần        Lượng người tranh chấp rất lớn
\`\`\`

Cách chọn: bắt đầu bằng giải pháp 1. Khi database bắt đầu quá tải vì ghi hold liên tục, chuyển phần giữ chỗ sang Redis nhưng vẫn giữ UPDATE có điều kiện ở database làm lớp bảo vệ cuối.

## Key Takeaways

1. Không giữ DB transaction qua mạng. Giữ chỗ bằng trạng thái tạm có hạn dùng: transaction ngắn, gọi thanh toán ngoài transaction, rồi transaction ngắn để chốt hoặc nhả.
2. Giải pháp chuẩn là Pending State trong database kèm \`expired_at\`. Chốt đơn luôn bằng UPDATE có điều kiện, kèm \`UNIQUE\` trên \`payment_transaction_id\` để chống xử lý trùng.
3. Giải pháp tăng tốc là hold trên Redis bằng \`SET NX EX\`, không bao giờ GET rồi SET, liệt kê bằng MGET, không bao giờ dùng KEYS.
4. Dù dùng giải pháp nào, database vẫn là nguồn sự thật và UPDATE có điều kiện là lớp chống bán trùng cuối cùng. Update ảnh hưởng 0 row thì hoàn tiền.
5. Với Redis: nhả hold bằng compare-and-delete, Lua Script cho nhiều ghế, AOF everysec cho trường hợp restart, hash tag trên Cluster.
    `
  },
  {
    id: 10,
    slug: 'idempotency-key-tranh-tru-tien-2-lan',
    title: "Idempotency Key: Tránh Trừ Tiền 2 Lần",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "9 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Khách bấm thanh toán, mạng chập chờn, app tự gửi lại và bị trừ tiền hai lần. Giải thích đơn giản cách chặn lỗi này bằng Idempotency Key lưu cùng database, State Machine và Reconciliation làm lưới an toàn.",
    tags: ["Idempotency", "Payment", "State Machine", "Concurrency", "System Design"],
    content: `
# Idempotency Key: Tránh Trừ Tiền 2 Lần

Người dùng bấm "Thanh toán", mạng chập chờn, app không nhận được kết quả nên tự gửi lại request. Hoặc người dùng thấy nút đứng yên và bấm thêm lần nữa. Server nhận hai request giống hệt nhau và trừ tiền hai lần.

Bài này giải thích cách chặn lỗi đó bằng ba thứ đơn giản: Idempotency Key, State Machine và Reconciliation.

## Idempotency là gì

Hãy nghĩ đến nút gọi thang máy. Bạn bấm một lần hay mười lần thì thang máy vẫn chỉ đến một lần. Đó là idempotency: làm một việc nhiều lần cho kết quả giống như làm một lần.

Với thanh toán, ta muốn: dù request bị gửi lại bao nhiêu lần, khách cũng chỉ bị trừ tiền đúng một lần.

Cách làm: mỗi lần khách chủ động bấm thanh toán, app tạo ra một "số phiếu" duy nhất, gọi là Idempotency Key. Server nhìn số phiếu đó để biết request này là mới hay chỉ là bản gửi lại.

## Bước 1: Client tạo key theo ý định, rồi giữ nguyên khi retry

\`\`\`
POST /payments
Idempotency-Key: 6f1c2b7e-3a54-4d0e-9a52-0c1f5d8b7a11
\`\`\`

Quy tắc:

1. Mỗi lần khách bấm thanh toán một đơn, tạo một key mới (thường là UUID).
2. Gửi lại vì lỗi mạng thì dùng lại đúng key cũ.
3. Khách thanh toán đơn khác hoặc số tiền khác thì dùng key mới.

Nếu mỗi lần retry lại tạo key mới, server sẽ tưởng là request mới và trừ tiền tiếp. Idempotency khi đó không còn tác dụng.

## Bước 2: Server lưu key trong database, có ràng buộc UNIQUE

Server cần nhớ key nào đã gặp. Hãy lưu nó ngay trong database của hệ thống, cùng nơi lưu đơn hàng:

\`\`\`sql
CREATE TABLE idempotency_keys (
  idempotency_key   VARCHAR(64) PRIMARY KEY,   -- UNIQUE: không thể có hai dòng cùng key
  request_hash      CHAR(64)    NOT NULL,      -- hash của nội dung request
  status            VARCHAR(16) NOT NULL,      -- IN_PROGRESS | COMPLETED
  response_snapshot JSONB,                     -- kết quả đã trả cho client
  created_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);
\`\`\`

Khi có request, đừng "kiểm tra xem key có chưa rồi mới thêm", vì hai request đến cùng lúc đều thấy "chưa có" và cả hai cùng đi tiếp. Hãy thêm thẳng và để database quyết định:

\`\`\`sql
INSERT INTO idempotency_keys (idempotency_key, request_hash, status)
VALUES ($1, $2, 'IN_PROGRESS')
ON CONFLICT (idempotency_key) DO NOTHING;
\`\`\`

Nếu thêm được 1 dòng, đây là request đầu tiên và được xử lý. Nếu 0 dòng, key đã có và bạn xem trạng thái của nó. Ràng buộc UNIQUE đảm bảo chỉ một request thắng, kể cả khi hai request đến cùng một mili-giây.

Nên lưu key trong database nghiệp vụ, không lưu riêng ở Redis. Hai nơi lưu khác nhau có thể lệch nhau (đã ghi key nhưng chưa ghi đơn, hoặc ngược lại).

## Bước 3: Khi gặp key đã có, trả lời thế nào

\`\`\`
Tình huống                          Trả về
Key có, đang IN_PROGRESS            409 Conflict (hoặc 202): "đang xử lý, chờ chút"
Key có, đã COMPLETED                200 + kết quả cũ (response_snapshot), KHÔNG trừ tiền lại
Key có, nhưng nội dung request khác 422: lỗi của client, không phải retry hợp lệ
\`\`\`

Dòng cuối là lý do ta lưu \`request_hash\`: cùng key mà khác số tiền thì chắc chắn là lỗi, không được âm thầm xử lý.

## Bước 4: Đừng giữ transaction mở khi gọi cổng thanh toán

Gọi dịch vụ bên ngoài có thể mất vài giây. Nếu gọi giữa \`BEGIN\` và \`COMMIT\`, database giữ khóa và connection suốt thời gian đó. Hãy chia làm hai transaction:

\`\`\`
Transaction 1: lưu key (IN_PROGRESS) + tạo payment (PROCESSING)  -> COMMIT
Gọi cổng thanh toán (ngoài transaction)
Transaction 2: cập nhật payment (SUCCEEDED/FAILED) + key = COMPLETED  -> COMMIT
\`\`\`

Hãy truyền một mã bất biến (ví dụ \`payment.id\`) làm Idempotency-Key khi gọi cổng thanh toán. Như vậy chính cổng thanh toán cũng nhận ra lần gọi lặp, không tạo thêm giao dịch.

Nếu server sập giữa hai transaction, key vẫn ở IN_PROGRESS. Phần Reconciliation bên dưới sẽ xử lý trường hợp này.

## State Machine: thay cờ is_paid bằng các trạng thái rõ ràng

Một cờ \`is_paid = true/false\` không diễn tả được "đang xử lý" hay "đã hoàn tiền". Hãy dùng các trạng thái:

\`\`\`
PENDING -> PROCESSING -> SUCCEEDED -> REFUNDED
                      -> FAILED
                      -> EXPIRED
\`\`\`

Và chỉ cho phép chuyển trạng thái hợp lệ, ngay trong câu \`UPDATE\`:

\`\`\`sql
UPDATE payments
SET status = 'SUCCEEDED', updated_at = NOW()
WHERE id = $1 AND status IN ('PENDING', 'PROCESSING');
\`\`\`

Nếu câu lệnh cập nhật được 0 dòng, nghĩa là có bên khác đã đổi trạng thái trước, và bạn bỏ qua thay vì ghi đè. Cách này gọi là Optimistic Locking. Nhờ nó, khi kết quả từ cổng thanh toán và webhook đến cùng lúc, chỉ một bên chốt được trạng thái, và một giao dịch đã SUCCEEDED không thể bị đổi ngược thành FAILED.

## Reconciliation: lưới an toàn cho những gì còn sót

Vẫn có hai tình huống không tránh khỏi: gọi cổng thanh toán bị timeout (không biết tiền đã bị trừ chưa) và webhook bị mất. Hãy chạy một job định kỳ (ví dụ mỗi phút) để hỏi lại:

\`\`\`sql
SELECT id FROM payments
WHERE status IN ('PENDING', 'PROCESSING')
  AND updated_at < NOW() - INTERVAL '10 minutes';
\`\`\`

Với mỗi payment tìm được, hỏi cổng thanh toán trạng thái thật bằng mã bất biến, rồi chuyển trạng thái bằng đúng câu \`UPDATE\` có điều kiện ở trên. Job chạy lại hay chạy chồng với webhook đều an toàn, và nhớ chuyển key đang kẹt IN_PROGRESS sang COMPLETED. Ngoài ra nên đối soát mỗi ngày với file settlement của cổng thanh toán.

## Ví dụ gọn: endpoint tạo thanh toán (Node.js + PostgreSQL)

Code dưới đây chỉ giữ phần cốt lõi. \`gateway\` là SDK của cổng thanh toán (giả định), thay bằng SDK thật của bạn. Phần validate input, kiểm tra quyền và xử lý lỗi chi tiết được lược bớt.

\`\`\`javascript
app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header is required' });

  const { orderId, amount } = req.body; // thực tế: validate bằng schema (zod, joi...)
  const requestHash = sha256(JSON.stringify({ orderId, amount }));

  // Transaction 1: giành quyền xử lý key + tạo payment
  const client = await pool.connect();
  let paymentId;
  try {
    await client.query('BEGIN');
    const claimed = await client.query(
      \`INSERT INTO idempotency_keys (idempotency_key, request_hash, status)
       VALUES ($1, $2, 'IN_PROGRESS') ON CONFLICT (idempotency_key) DO NOTHING\`,
      [key, requestHash]
    );

    if (claimed.rowCount === 0) {            // key đã tồn tại
      await client.query('ROLLBACK');
      const { rows } = await pool.query(
        'SELECT request_hash, status, response_snapshot FROM idempotency_keys WHERE idempotency_key = $1',
        [key]
      );
      const old = rows[0];
      if (old.request_hash !== requestHash) return res.status(422).json({ error: 'Key reused with a different request' });
      if (old.status === 'IN_PROGRESS')      return res.status(409).json({ error: 'Still being processed' });
      return res.status(200).json(old.response_snapshot); // trả lại kết quả cũ
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

  // Gọi cổng thanh toán NGOÀI transaction, kèm mã bất biến
  let charge;
  try {
    charge = await gateway.charge({ amount, orderId }, { idempotencyKey: String(paymentId) });
  } catch (err) {
    // Timeout: chưa biết tiền đã bị trừ chưa. Giữ PROCESSING, job reconcile sẽ hỏi lại.
    return res.status(202).json({ paymentId, status: 'PROCESSING' });
  }

  // Transaction 2: chốt trạng thái (UPDATE có điều kiện) và lưu kết quả
  const status = charge.ok ? 'SUCCEEDED' : 'FAILED';
  await pool.query(
    "UPDATE payments SET status = $2, updated_at = NOW() WHERE id = $1 AND status = 'PROCESSING'",
    [paymentId, status]
  );
  const body = { paymentId, status };
  await pool.query(
    "UPDATE idempotency_keys SET status = 'COMPLETED', response_snapshot = $2 WHERE idempotency_key = $1",
    [key, body]
  );
  return res.status(200).json(body);
});
\`\`\`

Hai điểm cần chú ý: nhánh timeout trả 202 chứ không báo lỗi, vì tiền có thể đã bị trừ; và \`UPDATE ... AND status = 'PROCESSING'\` đảm bảo nếu webhook đã chốt trước thì lần này không ghi đè.

### Kiểm tra nhanh bằng curl

\`\`\`bash
# gửi hai lần cùng key: lần 2 phải trả đúng kết quả cũ, không tạo payment mới
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":150000}'
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":150000}'

# cùng key nhưng khác số tiền: phải trả 422
curl -X POST localhost:3000/payments -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-key-001' -d '{"orderId":"A1","amount":999999}'
\`\`\`

## Những lỗi hay gặp

1. Tạo key mới cho mỗi lần retry. Key phải gắn với ý định của khách, không gắn với từng request.
2. Check-then-insert. Kiểm tra rồi mới thêm sẽ dính race condition. Hãy dùng UNIQUE kèm \`ON CONFLICT\`.
3. Giữ transaction mở khi gọi cổng thanh toán. Khóa và connection bị giữ quá lâu.
4. Webhook không idempotent. Cổng thanh toán thường gửi lại webhook nhiều lần, nên hãy lưu event id đã xử lý (bảng có UNIQUE trên \`event_id\`) và bỏ qua event đã thấy. Luôn verify chữ ký HMAC trước khi tin payload.
5. Quên dọn key cũ. Đặt thời hạn (ví dụ 24 giờ) và xóa key cũ, nếu không bảng sẽ phình mãi. Key IN_PROGRESS bị kẹt do server sập cần được job Reconciliation giải phóng.

## Key Takeaways

1. Idempotency Key biến "gửi lại nhiều lần" thành "chỉ xử lý một lần". Client tạo một key cho mỗi ý định thanh toán và dùng lại key đó khi retry.
2. Lưu key trong database cùng với dữ liệu nghiệp vụ, dùng UNIQUE và \`ON CONFLICT\` thay vì check-then-insert.
3. Gặp key đã có thì: đang xử lý trả 409 hoặc 202, đã xong trả lại kết quả cũ, khác nội dung request trả 422.
4. Dùng State Machine với \`UPDATE\` có điều kiện status thay cho cờ boolean, để webhook và response đồng bộ không ghi đè nhau.
5. Không gọi cổng thanh toán bên trong transaction, và truyền mã bất biến sang cổng thanh toán.
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
  (1, 101, '2026-12-01 09:00:00+00', '2026-12-01 10:00:00+00'),
  (1, 102, '2026-12-01 13:00:00+00', '2026-12-01 14:30:00+00');
\`\`\`

Mọi mốc thời gian trong bài đều là UTC (\`+00\`). Database luôn lưu UTC, nên khi truy vấn hãy truyền giá trị đã quy về UTC và ghi rõ offset. Một literal không có offset sẽ bị hiểu theo \`TimeZone\` của session, rất dễ lệch giờ. Việc đổi sang giờ địa phương chỉ làm ở tầng hiển thị.

## 3. Kiểm tra trùng lịch bằng SQL

Đừng kéo toàn bộ lịch về rồi lặp trong code. Hãy để database lọc trực tiếp, nhanh hơn và tốn ít bộ nhớ hơn:

\`\`\`sql
SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND status <> 'CANCELLED'              -- bỏ qua lịch đã hủy
    AND start_time < '2026-12-01 10:30:00+00'   -- newEnd
    AND end_time   > '2026-12-01 09:30:00+00'   -- newStart
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
  AND start_time < '2026-12-01 10:30:00+00'
  AND end_time   > '2026-12-01 09:30:00+00'
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
    AND start_time < '2026-12-01 11:00:00+00'
    AND end_time   > '2026-12-01 10:00:00+00'
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
    AND start_time < '2026-12-01 10:30:00+00'::timestamptz + INTERVAL '15 minutes'
    AND end_time   > '2026-12-01 09:30:00+00'::timestamptz - INTERVAL '15 minutes'
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
VALUES (1, 101, '2026-12-01 09:30:00+00', '2026-12-01 10:30:00+00');
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
  },
  {
    id: 12,
    slug: 'explicit-table-lock-postgresql',
    title: "Explicit Table Lock trong PostgreSQL: LOCK TABLE khi nào dùng, khi nào tránh",
    category: "Full-Stack",
    difficulty: "Advanced",
    readTime: "9 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "LOCK TABLE hoạt động ra sao, tám chế độ khóa chặn nhau thế nào, những tình huống đáng dùng (migration, batch, tuần tự hóa toàn bảng) và cái bẫy hàng chờ lock khiến một lệnh nhỏ làm đứng cả ứng dụng.",
    tags: ["PostgreSQL", "Locking", "Migration", "Concurrency", "Database"],
    content: `
# Explicit Table Lock trong PostgreSQL: LOCK TABLE khi nào dùng, khi nào tránh

Row lock giải quyết xung đột ở mức từng dòng. Nhưng có những việc liên quan đến cả bảng: đổi cấu trúc, dọn dữ liệu hàng loạt, hay một quy tắc nghiệp vụ chỉ cho phép một transaction chạy tại một thời điểm. Khi đó PostgreSQL cho bạn khóa cả bảng một cách tường minh bằng \`LOCK TABLE\`.

## LOCK TABLE hoạt động thế nào

\`\`\`sql
BEGIN;
LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE;
-- ... các câu lệnh cần bảng ổn định ...
COMMIT;  -- khóa tự động được giải phóng ở đây
\`\`\`

Ba điều cần nhớ:

1. \`LOCK TABLE\` chỉ dùng được trong một transaction. Chạy ngoài transaction sẽ báo lỗi, vì khóa sẽ được nhả ngay sau câu lệnh nên vô nghĩa.
2. Không có lệnh UNLOCK. Khóa chỉ được giải phóng khi COMMIT hoặc ROLLBACK.
3. Nếu bỏ qua tên chế độ, mặc định là ACCESS EXCLUSIVE, chế độ mạnh nhất.

Bạn cũng đang dùng table lock mà không để ý: mỗi câu SELECT lấy ACCESS SHARE, mỗi INSERT/UPDATE/DELETE lấy ROW EXCLUSIVE, và hầu hết các dạng \`ALTER TABLE\` lấy ACCESS EXCLUSIVE. \`LOCK TABLE\` chỉ là cách chủ động chọn chế độ thay vì để PostgreSQL tự chọn.

## Các chế độ khóa chặn nhau thế nào

PostgreSQL có 8 chế độ, xếp từ nhẹ đến nặng. Những chế độ đáng nhớ nhất:

\`\`\`
Chế độ                  Chặn những thao tác nào                        Dùng khi
ACCESS SHARE            Chỉ ACCESS EXCLUSIVE                           SELECT thông thường (tự động)
ROW EXCLUSIVE           Từ SHARE trở lên                               INSERT/UPDATE/DELETE (tự động)
SHARE                   Mọi ghi (UPDATE/DELETE/INSERT), vẫn cho đọc    Cần ảnh chụp bảng ổn định, CREATE INDEX
SHARE ROW EXCLUSIVE     Mọi ghi và cả chính nó, vẫn cho đọc            Tuần tự hóa các writer, chặn ghi mà chỉ một bên được vào
EXCLUSIVE               Mọi thứ trừ SELECT thường                      Chặn gần như toàn bộ, chỉ cho đọc
ACCESS EXCLUSIVE        Tất cả, kể cả SELECT                           ALTER TABLE, DROP, TRUNCATE, VACUUM FULL
\`\`\`

Lưu ý một hiểu lầm hay gặp: chỉ ACCESS EXCLUSIVE mới chặn cả đọc. EXCLUSIVE vẫn cho phép SELECT thông thường chạy song song, chỉ chặn ghi và các câu như \`SELECT ... FOR UPDATE\`. Bảng đầy đủ về ma trận xung đột nằm trong tài liệu chính thức, mục Explicit Locking.

## Ví dụ trực quan với hai session

Mở hai cửa sổ psql với bảng \`orders(id, status, total)\` để tự quan sát. Mỗi ví dụ dưới đây là một kịch bản riêng.

### Ví dụ A: SHARE chặn ghi nhưng vẫn cho đọc

\`\`\`sql
-- Session 1
BEGIN;
LOCK TABLE orders IN SHARE MODE;

-- Session 2
SELECT count(*) FROM orders;                      -- chạy ngay, bình thường
UPDATE orders SET status = 'paid' WHERE id = 1;   -- bị TREO, chờ Session 1

-- Session 1
COMMIT;                                           -- Session 2 được chạy tiếp
\`\`\`

### Ví dụ B: ACCESS EXCLUSIVE chặn cả đọc

\`\`\`sql
-- Session 1
BEGIN;
LOCK TABLE orders IN ACCESS EXCLUSIVE MODE;

-- Session 2
SELECT * FROM orders LIMIT 1;                     -- bị TREO, ngay cả SELECT

-- Session 1
ROLLBACK;                                         -- Session 2 chạy tiếp
\`\`\`

### Ví dụ C: NOWAIT báo lỗi thay vì chờ

\`\`\`sql
-- Session 1
BEGIN;
LOCK TABLE orders IN EXCLUSIVE MODE;

-- Session 2
BEGIN;
LOCK TABLE orders IN ROW EXCLUSIVE MODE NOWAIT;
-- ERROR:  could not obtain lock on relation "orders"
ROLLBACK;
\`\`\`

### Ví dụ D: lock_timeout cắt thời gian chờ

\`\`\`sql
-- Session 2 (Session 1 vẫn đang giữ EXCLUSIVE)
BEGIN;
SET LOCAL lock_timeout = '2s';
UPDATE orders SET total = total + 1 WHERE id = 1;
-- sau 2 giây: ERROR:  canceling statement due to lock timeout
ROLLBACK;
\`\`\`

### Ví dụ E: nhìn thấy ai đang chờ ai

Khi một session bị treo, mở session thứ ba và chạy:

\`\`\`sql
SELECT pid,
       pg_blocking_pids(pid) AS bi_chan_boi,
       wait_event_type,
       state,
       left(query, 60) AS query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
\`\`\`

Cột \`bi_chan_boi\` cho biết PID đang giữ khóa. Nếu cần, bạn có thể hủy nó bằng \`SELECT pg_cancel_backend(<pid>)\`, nhưng hãy kiểm tra đó là transaction nào trước.

## Bốn tình huống đáng dùng

### 1. Migration và thay đổi cấu trúc an toàn

\`ALTER TABLE\` vốn đã cần khóa mạnh. Điều bạn kiểm soát được là thời điểm và thời gian chờ, như phần bẫy hàng chờ bên dưới.

\`\`\`sql
BEGIN;
SET LOCAL lock_timeout = '3s';
ALTER TABLE orders ADD COLUMN note text;
COMMIT;
\`\`\`

### 2. Batch update hoặc archival lớn

Khi một job sửa hoặc xóa lượng lớn dòng liên quan đến nhiều bảng, khóa bảng ở chế độ phù hợp giúp tránh race condition và giảm nguy cơ deadlock với các transaction khác đang đan xen. Đổi lại, job phải chạy ngoài giờ cao điểm.

\`\`\`sql
BEGIN;
SET LOCAL lock_timeout = '5s';
-- khóa theo thứ tự cố định để tránh deadlock
LOCK TABLE orders, order_items IN SHARE ROW EXCLUSIVE MODE;

INSERT INTO orders_archive
SELECT * FROM orders WHERE created_at < now() - interval '1 year';

DELETE FROM order_items
WHERE order_id IN (SELECT id FROM orders WHERE created_at < now() - interval '1 year');

DELETE FROM orders WHERE created_at < now() - interval '1 year';
COMMIT;
\`\`\`

### 3. Tuần tự hóa tuyệt đối trên toàn bảng

Có nghiệp vụ mà khóa dòng không đủ bao quát: ví dụ cấp số chứng từ liên tục không được hở, hoặc tổng hợp số dư trên cả bảng. Row lock không bảo vệ được dòng chưa tồn tại (phantom), còn table lock thì có:

\`\`\`sql
BEGIN;
LOCK TABLE invoices IN SHARE ROW EXCLUSIVE MODE;
INSERT INTO invoices (number, customer_id, amount)
SELECT COALESCE(MAX(number), 0) + 1, 42, 150000
FROM invoices;
COMMIT;
\`\`\`

SHARE ROW EXCLUSIVE tự xung đột với chính nó, nên chỉ một transaction chạy đoạn này mỗi lần, trong khi các truy vấn đọc vẫn bình thường.

### 4. Giữ bảng ổn định trong chuỗi nhiều bước

Ví dụ thay thế bảng bằng cách tạo bảng mới, nạp dữ liệu rồi đổi tên, cả chuỗi nằm trong một transaction để không ai thấy trạng thái nửa vời.

\`\`\`sql
BEGIN;
SET LOCAL lock_timeout = '3s';
LOCK TABLE products IN ACCESS EXCLUSIVE MODE;

CREATE TABLE products_new (LIKE products INCLUDING ALL);
INSERT INTO products_new SELECT * FROM products WHERE is_active;

ALTER TABLE products RENAME TO products_old;
ALTER TABLE products_new RENAME TO products;
COMMIT;
\`\`\`

## Cái bẫy lớn nhất: hàng chờ lock

Giả sử bạn chạy \`ALTER TABLE\` (cần ACCESS EXCLUSIVE) trong lúc một báo cáo chạy 10 phút đang giữ ACCESS SHARE. Lệnh ALTER phải chờ. Điều tệ là mọi SELECT mới đến sau cũng phải xếp hàng đằng sau ALTER, vì PostgreSQL không cho "chen ngang" qua một yêu cầu khóa đang chờ.

\`\`\`
t0   Báo cáo dài     giữ ACCESS SHARE
t1   ALTER TABLE     xin ACCESS EXCLUSIVE   -> chờ báo cáo
t2   SELECT mới       xin ACCESS SHARE       -> chờ ALTER (dù chỉ đọc)
t3   Pool cạn kết nối, ứng dụng đứng
\`\`\`

Một lệnh migration nhỏ có thể làm đứng cả ứng dụng, dù bản thân nó chạy chưa tới một giây khi được cấp khóa. Cách phòng:

\`\`\`sql
-- báo lỗi ngay thay vì xếp hàng
LOCK TABLE orders IN ACCESS EXCLUSIVE MODE NOWAIT;

-- hoặc chờ có giới hạn
SET LOCAL lock_timeout = '3s';
\`\`\`

Nếu bị từ chối, retry sau một lúc, ngoài giờ cao điểm.

## Nguyên tắc sử dụng an toàn

1. Chọn chế độ yếu nhất đủ dùng. Cần chặn ghi mà vẫn cho đọc thì dùng SHARE hoặc SHARE ROW EXCLUSIVE, đừng mặc định ACCESS EXCLUSIVE.
2. Luôn đặt \`lock_timeout\` hoặc dùng NOWAIT, và code phải biết retry khi bị từ chối.
3. Giữ transaction ngắn. Khóa sống đến COMMIT, nên đừng gọi API ngoài hay chờ con người giữa chừng.
4. Khóa nhiều bảng theo cùng một thứ tự ở mọi nơi để tránh deadlock.
5. Chạy ngoài giờ cao điểm và theo dõi \`pg_locks\` khi cần:

\`\`\`sql
SELECT l.pid, l.mode, l.granted, a.query
FROM pg_locks l
JOIN pg_stat_activity a USING (pid)
WHERE l.relation = 'orders'::regclass
ORDER BY l.granted, l.pid;
\`\`\`

## Ưu tiên giải pháp nhẹ hơn

Table lock là công cụ nặng. Trước khi dùng, hãy cân nhắc:

\`\`\`
Nhu cầu                                  Giải pháp nhẹ hơn
Khóa từng bản ghi                        SELECT ... FOR UPDATE (row lock)
Khóa theo logic hoặc tài nguyên ngoài    pg_advisory_xact_lock(key)
Tạo index trên bảng đang chạy            CREATE INDEX CONCURRENTLY
Chống trùng dữ liệu                      UNIQUE hoặc EXCLUDE constraint
Số thứ tự tăng                           SEQUENCE (chấp nhận có khoảng hở)
\`\`\`

Advisory lock đặc biệt hữu ích cho ví dụ cấp số chứng từ ở trên: khóa một key logic thay vì cả bảng, nên các truy vấn khác không bị ảnh hưởng.

## Key Takeaways

1. \`LOCK TABLE ... IN <mode> MODE\` chỉ chạy trong transaction và tự nhả khi COMMIT hoặc ROLLBACK. Mặc định là ACCESS EXCLUSIVE.
2. Chỉ ACCESS EXCLUSIVE chặn cả đọc. Các chế độ SHARE, SHARE ROW EXCLUSIVE và EXCLUSIVE vẫn cho SELECT thường chạy.
3. Dùng cho migration, batch lớn, tuần tự hóa toàn bảng hoặc chuỗi bước cần bảng ổn định.
4. Hàng chờ lock là rủi ro thật: một lock đang chờ cũng chặn các truy vấn đến sau. Luôn dùng NOWAIT hoặc \`lock_timeout\`.
5. Có row lock, advisory lock, constraint hoặc \`CONCURRENTLY\` đáp ứng được thì ưu tiên chúng.
    `
  },
  {
    id: 13,
    slug: 'advisory-lock-postgresql-don-gian',
    title: "Advisory Lock trong PostgreSQL: khóa theo ý bạn, không cần khóa bảng hay dòng",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "7 min read",
    date: "2026-11-19",
    featured: false,
    excerpt: "Advisory lock là ổ khóa do bạn tự đặt tên bằng một con số. Giải thích đơn giản bằng ví dụ: chặn cron job chạy trùng, chặn bấm thanh toán hai lần, và những lỗi hay gặp khi dùng.",
    tags: ["PostgreSQL", "Advisory Lock", "Concurrency", "Locking", "Database"],
    content: `
# Advisory Lock trong PostgreSQL: khóa theo ý bạn, không cần khóa bảng hay dòng

Row lock khóa một dòng. Table lock khóa cả bảng. Nhưng đôi khi thứ bạn muốn khóa không phải dòng hay bảng, mà là một việc: "đang chạy báo cáo tháng này", "đang xử lý thanh toán của user 42". Với những trường hợp đó, PostgreSQL có advisory lock.

## Advisory lock là gì

Hãy hình dung một cái phòng họp có một ổ khóa. Ổ khóa không gắn vào bàn hay ghế nào cả. Ai vào trước thì khóa lại, người đến sau phải chờ hoặc quay về.

Advisory lock hoạt động giống vậy:

1. Bạn chọn một con số bất kỳ làm "tên" của ổ khóa, ví dụ \`42\`.
2. Ai xin khóa số \`42\` trước thì được. Người xin sau phải chờ hoặc bị từ chối.
3. PostgreSQL không biết số 42 nghĩa là gì và không gắn nó vào bảng nào. Ý nghĩa do ứng dụng của bạn quy định.

Chữ "advisory" nghĩa là "mang tính thỏa thuận": database chỉ giữ ổ khóa, còn việc mọi đoạn code đều chịu xin khóa trước khi làm là do bạn tự bảo đảm.

## Ví dụ 1: ổ khóa đơn giản nhất

\`\`\`sql
-- Session 1
SELECT pg_advisory_lock(42);        -- lấy được ngay

-- Session 2
SELECT pg_advisory_lock(42);        -- bị TREO, chờ Session 1

-- Session 1
SELECT pg_advisory_unlock(42);      -- nhả khóa, Session 2 chạy tiếp
\`\`\`

Hai session không cần bảng nào cả. Chúng chỉ cùng xin ổ khóa số 42.

## Hai loại: theo session và theo transaction

\`\`\`sql
-- Theo session: giữ cho đến khi bạn tự unlock hoặc ngắt kết nối
SELECT pg_advisory_lock(42);
SELECT pg_advisory_unlock(42);

-- Theo transaction: tự nhả khi COMMIT hoặc ROLLBACK
BEGIN;
SELECT pg_advisory_xact_lock(42);
-- ... làm việc ...
COMMIT;                              -- khóa tự nhả, không có hàm unlock
\`\`\`

Nên ưu tiên loại \`xact\`. Bạn không thể quên nhả khóa, vì transaction kết thúc là khóa mất. Loại session dễ bị "rò khóa" khi code lỗi giữa chừng.

## Ví dụ 2: cron job không được chạy hai lần

Bạn có job gửi email nhắc lịch chạy mỗi phút. Chạy trên 3 server thì cả 3 cùng chạy và khách nhận 3 email. Dùng \`pg_try_advisory_lock\`: hàm này không chờ mà trả về ngay true hoặc false.

\`\`\`sql
SELECT pg_try_advisory_lock(1001);
-- true  -> bạn được chạy job
-- false -> server khác đang chạy, bỏ qua lượt này
\`\`\`

Ba server cùng hỏi cùng lúc, chỉ một server nhận được \`true\`. Chạy xong thì nhả:

\`\`\`sql
SELECT pg_advisory_unlock(1001);
\`\`\`

Số \`1001\` ở đây là số bạn tự quy ước cho job "gửi email nhắc lịch". Hãy ghi quy ước này vào code, ví dụ một hằng số \`JOB_REMINDER_EMAIL = 1001\`.

## Ví dụ 3: chặn một user thanh toán hai lần cùng lúc

Khách hàng bấm nút "Thanh toán" hai lần, hai request chạy song song. Ta muốn các request của cùng một user phải xếp hàng, còn user khác vẫn chạy bình thường. Dùng chính \`user_id\` làm tên ổ khóa:

\`\`\`sql
BEGIN;
SELECT pg_advisory_xact_lock(42);    -- 42 là user_id

-- kiểm tra và tạo đơn thanh toán an toàn, vì không ai khác của user 42 chen vào được
SELECT count(*) FROM payments
WHERE user_id = 42 AND status = 'pending';

INSERT INTO payments (user_id, amount, status)
VALUES (42, 150000, 'pending');

COMMIT;                              -- khóa tự nhả
\`\`\`

Request thứ hai của user 42 sẽ chờ ở dòng \`pg_advisory_xact_lock\` cho đến khi request đầu COMMIT, rồi thấy đơn \`pending\` đã tồn tại và dừng lại. Request của user 7 dùng ổ khóa số 7 nên không bị ảnh hưởng.

Điểm hay: cách này hoạt động ngay cả khi dòng chưa tồn tại, nơi \`SELECT ... FOR UPDATE\` không có gì để khóa.

## Khóa bằng chuỗi thay vì số

Ổ khóa cần là số nguyên. Nếu tên của bạn là chuỗi, hãy băm ra số:

\`\`\`sql
SELECT pg_advisory_xact_lock(hashtextextended('report:2026-11', 0));
\`\`\`

Với ví dụ trên, mọi session xin khóa cho cùng chuỗi \`report:2026-11\` sẽ cùng ra một số, nên xếp hàng với nhau. Đây là cách dễ đọc hơn việc nhớ các số tự quy ước.

## Cách chọn: chờ, thử, hay báo lỗi

\`\`\`
Hàm                              Hành vi khi ổ khóa đang bị giữ
pg_advisory_xact_lock(k)         Chờ đến khi có khóa
pg_try_advisory_xact_lock(k)     Trả về false ngay, không chờ
\`\`\`

Dùng \`try\` khi bỏ qua được (cron job, tác vụ nền). Dùng bản chờ khi bắt buộc phải làm tuần tự (thanh toán). Với bản chờ, nên đặt \`SET LOCAL lock_timeout = '5s'\` để không bị treo vô hạn.

## Xem ai đang giữ khóa

\`\`\`sql
SELECT pid, objid AS khoa, granted
FROM pg_locks
WHERE locktype = 'advisory';
\`\`\`

Cột \`granted = false\` nghĩa là session đó đang đứng chờ.

## Những lỗi hay gặp

### 1. Quên nhả khóa kiểu session

Nếu code lỗi trước khi gọi \`pg_advisory_unlock\`, khóa vẫn còn đến khi kết nối đóng. Dùng loại \`xact\` để tránh.

### 2. Dùng khóa session cùng connection pool

Với PgBouncer ở chế độ transaction pooling, câu lệnh lock và câu lệnh unlock có thể chạy trên hai kết nối khác nhau. Khóa kẹt ở kết nối này, còn unlock lại chạy ở kết nối kia. Với pool, chỉ dùng loại \`xact\` trong một transaction.

### 3. Hai chức năng vô tình dùng chung một số

Nếu job A và job B cùng chọn số \`1001\`, chúng sẽ chặn nhau mà không ai hiểu vì sao. Hãy gom các số quy ước vào một chỗ trong code.

### 4. Nhầm hành vi khi ROLLBACK

Khóa theo transaction luôn được nhả khi COMMIT hoặc ROLLBACK. Khóa theo session thì ROLLBACK không nhả, nó vẫn nằm đó cho đến khi bạn unlock hoặc đóng kết nối. Hãy chắc chắn bạn đang dùng đúng loại cho nhu cầu của mình.

## So sánh nhanh

\`\`\`
Loại khóa          Khóa cái gì          Gắn với dữ liệu thật   Dùng khi
Row lock           Một hoặc vài dòng    Có                     Sửa dòng đang tồn tại
Table lock         Cả bảng              Có                     Migration, batch lớn
Advisory lock      Một con số tự đặt    Không                  Khóa một việc hoặc tài nguyên logic
\`\`\`

## Key Takeaways

1. Advisory lock là ổ khóa mang tên một con số do bạn tự đặt, PostgreSQL không gắn nó vào bảng hay dòng nào.
2. Ưu tiên \`pg_advisory_xact_lock\`: khóa tự nhả khi COMMIT hoặc ROLLBACK, không sợ quên.
3. Dùng \`pg_try_advisory_lock\` cho cron job hoặc tác vụ có thể bỏ qua, dùng bản chờ cho việc bắt buộc tuần tự.
4. Rất hợp để khóa theo \`user_id\` hoặc theo tên tác vụ, kể cả khi dòng dữ liệu chưa tồn tại.
5. Đừng dùng khóa kiểu session với connection pool theo transaction, và hãy ghi lại các số quy ước để không bị trùng.
    `
  },
  {
    id: 14,
    slug: 'postgresql-migration-production-khong-downtime',
    title: "Chạy PostgreSQL migration trên production tải cao mà không downtime",
    category: "Database",
    difficulty: "Advanced",
    readTime: "12 min read",
    date: "2026-11-20",
    featured: false,
    excerpt: "Quy trình Expand → Migrate → Contract cho PostgreSQL: lock_timeout, thêm cột, tạo index CONCURRENTLY, đổi tên cột, đổi kiểu dữ liệu, backfill theo batch và retry wrapper, kèm so sánh chi phí.",
    tags: ["PostgreSQL", "Migration", "Zero Downtime", "Locking", "Database"],
    content: `
# Chạy PostgreSQL migration trên production tải cao mà không downtime

Một câu \`ALTER TABLE\` chạy mất vài mili-giây trên máy dev có thể làm sập cả hệ thống production. Lý do không nằm ở việc nó chạy chậm, mà ở việc nó phải xin khóa mạnh nhất của PostgreSQL. Bài này tóm tắt quy trình chuẩn để chạy migration an toàn khi hệ thống đang có tải cao.

## Nguyên tắc cốt lõi

\`\`\`
Nguyên tắc                              Lý do
Expand -> Migrate -> Contract           Tách thành các bước tương thích ngược, deploy app và DB độc lập
Luôn đặt lock_timeout (2-5s) và retry   ALTER TABLE cần ACCESS EXCLUSIVE. Nếu bị 1 transaction dài chặn,
                                        mọi query sau đó xếp hàng chờ theo, hệ thống treo
Đặt statement_timeout cho DDL           Tránh DDL chạy vô hạn
Backfill theo batch, commit từng batch  Tránh long transaction, bloat, replication lag
Không rewrite bảng giờ cao điểm         Rewrite = khóa cả bảng + I/O tăng gấp đôi
Mỗi migration chỉ làm 1 việc            Dễ kiểm soát, có rollback plan rõ ràng
\`\`\`

Vì sao \`lock_timeout\` quan trọng đến vậy? \`ALTER TABLE\` cần \`ACCESS EXCLUSIVE\` lock. Giả sử có một transaction dài đang đọc bảng. DDL của bạn phải chờ nó. Trong lúc chờ, mọi query mới (kể cả \`SELECT\` đơn giản) đều xếp hàng sau DDL, nên chỉ một transaction dài là đủ làm cả bảng đứng im. Đặt \`lock_timeout\` ngắn để DDL tự bỏ cuộc thay vì kéo cả hệ thống chờ cùng.

Phần thiết lập session dùng chung cho mọi DDL:

\`\`\`sql
SET lock_timeout = '3s';
SET statement_timeout = '15min';  -- tăng nếu chạy CONCURRENTLY lâu
\`\`\`

## Checklist trước khi chạy

1. Test trên bản restore hoặc clone của production, cùng khối lượng dữ liệu.
2. Kiểm tra transaction chạy lâu:

\`\`\`sql
SELECT pid, now() - xact_start AS age, query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY age DESC;
\`\`\`

3. Chạy ngoài giờ cao điểm và có người trực.
4. Theo dõi lock waits, replication lag, CPU/IO và error rate trên Grafana/Prometheus.
5. Lint migration tự động trong CI bằng squawk hoặc các rule kiểu strong_migrations.

## Thêm cột mới

Từ PostgreSQL 11, \`ADD COLUMN\` nullable, hoặc có default là hằng số, chỉ sửa metadata nên chạy tức thì.

\`\`\`sql
SET lock_timeout = '3s';
ALTER TABLE orders ADD COLUMN status_v2 text;               -- instant
ALTER TABLE orders ADD COLUMN source text DEFAULT 'web';    -- instant (PG11+, default hằng số)
\`\`\`

Cần \`NOT NULL\`? Đừng chạy \`SET NOT NULL\` trực tiếp, vì nó quét toàn bảng trong lúc giữ khóa mạnh. Hãy đi đường vòng bằng CHECK constraint:

\`\`\`sql
ALTER TABLE orders ADD CONSTRAINT orders_source_nn
  CHECK (source IS NOT NULL) NOT VALID;                     -- instant

ALTER TABLE orders VALIDATE CONSTRAINT orders_source_nn;
-- quét bảng, nhưng chỉ giữ SHARE UPDATE EXCLUSIVE, không chặn đọc/ghi

ALTER TABLE orders ALTER COLUMN source SET NOT NULL;
-- PG12+: bỏ qua bước quét nhờ CHECK đã validated

ALTER TABLE orders DROP CONSTRAINT orders_source_nn;
\`\`\`

Lưu ý: default kiểu volatile (ví dụ \`gen_random_uuid()\`) sẽ khiến PostgreSQL rewrite cả bảng. Khi đó hãy thêm cột nullable rồi backfill theo batch.

## Thêm index

Luôn dùng \`CONCURRENTLY\`. Nó không chặn write, đổi lại chậm hơn khoảng 2 lần và không chạy được bên trong transaction.

\`\`\`sql
SET lock_timeout = '3s';
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders (customer_id);

-- Nếu bị lỗi hoặc bị cancel, PostgreSQL để lại index INVALID. Kiểm tra:
SELECT indexrelid::regclass, indisvalid
FROM pg_index
WHERE indexrelid = 'idx_orders_customer_id'::regclass;

-- Nếu invalid: drop rồi tạo lại
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_customer_id;
\`\`\`

Một vài lưu ý:

1. Unique constraint: tạo \`UNIQUE INDEX CONCURRENTLY\` trước, sau đó \`ALTER TABLE ... ADD CONSTRAINT ... UNIQUE USING INDEX idx_name\`.
2. Bảng partitioned: tạo index \`CONCURRENTLY\` trên từng partition, sau đó \`CREATE INDEX ON ONLY parent\` và \`ATTACH PARTITION INDEX\`.
3. Tăng \`maintenance_work_mem\` cho session để build nhanh hơn.
4. Với node-pg-migrate, phải tắt transaction cho migration này bằng \`pgm.noTransaction()\`.

## Đổi tên cột không downtime

\`RENAME COLUMN\` chỉ sửa metadata nên rất nhanh, nhưng nó làm vỡ code cũ đang chạy trong lúc rolling deploy. Cách an toàn nhất là Expand/Contract.

Bước 1 và 2: thêm cột mới, rồi dùng trigger giữ hai cột đồng bộ (hoặc dual-write ở app).

\`\`\`sql
-- Bước 1 (Expand)
ALTER TABLE users ADD COLUMN full_name text;

-- Bước 2: đồng bộ dữ liệu ghi mới
CREATE OR REPLACE FUNCTION users_sync_full_name() RETURNS trigger AS $$
BEGIN
  NEW.full_name := COALESCE(NEW.full_name, NEW.name);
  NEW.name      := COALESCE(NEW.name, NEW.full_name);
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_sync BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION users_sync_full_name();
\`\`\`

Bước 3: backfill dữ liệu cũ theo batch. Script lặp lại câu lệnh này, nghỉ một chút giữa các batch, cho đến khi không còn dòng nào được cập nhật.

\`\`\`sql
UPDATE users SET full_name = name
WHERE id IN (
  SELECT id FROM users WHERE full_name IS NULL ORDER BY id LIMIT 5000
);
\`\`\`

Bước 4: deploy app đọc/ghi \`full_name\`. Bước 5 (Contract): sau khi chạy ổn định một release, drop trigger và \`ALTER TABLE users DROP COLUMN name;\`.

Có cách B là rename rồi dùng view tương thích, hợp với bảng ít bị nhiều service truy cập trực tiếp. Khi nhiều service dùng chung DB thì cách này phức tạp hơn, nên ưu tiên cách A.

## Đổi kiểu dữ liệu

Trước hết kiểm tra xem thay đổi đó có cần rewrite bảng không:

\`\`\`
Thay đổi                                   Rewrite?
varchar(n) -> tăng n, hoặc -> text         Không
int -> bigint                              Có (khóa cả bảng)
text -> jsonb, int -> text                 Có
\`\`\`

Nếu có rewrite, dùng Expand/Contract. Ví dụ đổi \`id\` từ \`int\` sang \`bigint\`:

\`\`\`sql
-- 1. Expand
ALTER TABLE events ADD COLUMN id_new bigint;

-- 2. Trigger giữ đồng bộ dữ liệu mới
CREATE OR REPLACE FUNCTION events_sync_id() RETURNS trigger AS $$
BEGIN NEW.id_new := NEW.id; RETURN NEW; END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_sync BEFORE INSERT OR UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION events_sync_id();
\`\`\`

Bước 3, backfill theo batch bằng Node.js (node-postgres). Mỗi batch là một transaction ngắn, có nghỉ giữa các lần:

\`\`\`javascript
const BATCH = 5000;
for (;;) {
  const { rowCount } = await pool.query(
    \`UPDATE events SET id_new = id
     WHERE id IN (SELECT id FROM events WHERE id_new IS NULL ORDER BY id LIMIT $1)\`,
    [BATCH]
  );
  if (rowCount === 0) break;
  // throttle; nếu có replica thì kiểm tra replication lag trước khi chạy tiếp
  await new Promise((r) => setTimeout(r, 100));
}
\`\`\`

Bước 4 và 5: tạo index trên cột mới, rồi hoán đổi trong một transaction rất ngắn (\`lock_timeout\` vẫn bật).

\`\`\`sql
-- 4. Index và constraint trên cột mới
CREATE UNIQUE INDEX CONCURRENTLY events_id_new_key ON events (id_new);
-- Khóa chính cần NOT NULL: dùng CHECK ... NOT VALID + VALIDATE như phần thêm cột

-- 5. Swap
BEGIN;
ALTER TABLE events DROP CONSTRAINT events_pkey;
ALTER TABLE events ADD CONSTRAINT events_pkey PRIMARY KEY USING INDEX events_id_new_key;
ALTER TABLE events RENAME COLUMN id TO id_old;
ALTER TABLE events RENAME COLUMN id_new TO id;
COMMIT;

-- 6. Contract: drop trigger, drop id_old sau khi xác nhận ổn định
\`\`\`

Với khóa chính, khóa ngoại và sequence phức tạp, hãy cân nhắc công cụ chuyên dụng: pg_repack hoặc pg-osc cho online schema change, pgroll cho expand/contract tự động.

## Retry wrapper cho lock_timeout

Khi \`lock_timeout\` hết hạn, PostgreSQL trả lỗi \`55P03\` (lock_not_available). Đó không phải lỗi thật, chỉ là "chưa lấy được khóa, thử lại sau". Hãy bọc DDL bằng một đoạn retry:

\`\`\`javascript
async function ddlWithRetry(pool, sql, { retries = 10, delayMs = 2000 } = {}) {
  for (let i = 1; i <= retries; i++) {
    const client = await pool.connect();
    try {
      await client.query(\`SET lock_timeout = '3s'\`);
      await client.query(sql);
      return;
    } catch (e) {
      if (e.code !== '55P03' || i === retries) throw e; // 55P03 = lock_not_available
      await new Promise((r) => setTimeout(r, delayMs * i)); // backoff tăng dần
    } finally {
      client.release();
    }
  }
}
\`\`\`

Dùng \`SET\` trên một client lấy từ pool rồi trả lại pool thì giá trị đó vẫn còn trên connection. Nếu pool được dùng chung cho traffic của app, hãy dùng \`SET LOCAL\` trong transaction hoặc một connection riêng cho migration.

## So sánh phương pháp và chi phí

\`\`\`
Phương pháp                    Ưu điểm                   Nhược điểm                       Chi phí
DDL trực tiếp (metadata-only)  Nhanh, đơn giản           Chỉ áp dụng cho vài loại đổi     Rất thấp
CONCURRENTLY / NOT VALID       Không chặn traffic        Lâu hơn, phải dọn index invalid  Thấp
Expand/Contract + backfill     An toàn, rollback dễ,     Nhiều bước, nhiều release,       Trung bình: khoảng 1-3 ngày
                               zero downtime             code tạm thời phức tạp           công, +1 cột tạm, I/O và WAL tăng
Công cụ ngoài (pg-osc, pgroll) Tự động hóa               Thêm dependency, cần học/test    Trung bình
\`\`\`

## Rollback

Mỗi bước của giai đoạn Expand đều có thể quay lui (drop cột hoặc trigger mới) mà không ảnh hưởng dữ liệu cũ. Chỉ bước Contract, tức drop cột cũ, là không thể đảo ngược. Vì vậy hãy backup hoặc snapshot trước, và chờ đủ thời gian quan sát rồi mới thực hiện.

## Key Takeaways

1. Chia thay đổi lớn thành các bước tương thích ngược: Expand, Migrate, Contract.
2. Luôn đặt \`lock_timeout\` ngắn kèm retry, và \`statement_timeout\` cho DDL, để một transaction dài không kéo sập cả hệ thống.
3. Thêm index bằng \`CONCURRENTLY\`, thêm ràng buộc bằng \`NOT VALID\` rồi \`VALIDATE\`.
4. Đổi tên cột hay đổi kiểu cần rewrite thì dùng cột mới, trigger đồng bộ và backfill theo batch, đừng đổi trực tiếp.
5. Test trên bản clone, chạy ngoài giờ cao điểm, có người trực và có rollback plan. Chỉ bước Contract là không quay lại được.
    `
  },
  {
    id: 15,
    slug: 'aws-cdk-lab-typescript-cdk-nag-oidc',
    title: "AWS CDK: viết hạ tầng bằng TypeScript, test và kiểm tra bảo mật trước khi deploy",
    category: "Cloud Infrastructure",
    difficulty: "Intermediate",
    readTime: "7 min read",
    date: "2026-11-20",
    featured: false,
    excerpt: "Những thế mạnh thực sự của AWS CDK qua một lab nhỏ: default an toàn, grant() cho IAM, tách dev/prod bằng code, cdk-nag, unit test và CI/CD với OIDC, kèm cạm bẫy Budget luôn hiện $0.",
    tags: ["AWS CDK", "TypeScript", "cdk-nag", "IaC", "GitHub Actions", "OIDC"],
    content: `
# AWS CDK: viết hạ tầng bằng TypeScript, test và kiểm tra bảo mật trước khi deploy

AWS CDK cho phép bạn mô tả hạ tầng AWS bằng một ngôn ngữ lập trình thật (ở đây là TypeScript) thay vì viết YAML. Bài này dùng một lab nhỏ gồm S3, IAM và Budget để chỉ ra những thế mạnh thực sự của CDK, và vài cạm bẫy cần tránh.

## CDK thực chất là gì

\`\`\`
code TypeScript -> cdk synth -> template CloudFormation -> cdk deploy -> tài nguyên AWS
\`\`\`

CDK không tạo tài nguyên trực tiếp. Nó sinh ra template CloudFormation rồi giao cho CloudFormation làm. Điều này quan trọng vì mọi bước trước \`deploy\` (test, kiểm tra bảo mật, xem diff) đều chạy được mà không tốn tiền.

## Thế mạnh 1: default an toàn, code ngắn

Đây là toàn bộ code để tạo một bucket an toàn:

\`\`\`javascript
const bucket = new s3.Bucket(this, 'DataBucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
});
\`\`\`

Ba dòng cấu hình này tự sinh ra mã hóa, chặn public access và một bucket policy từ chối request không dùng HTTPS. Viết tay bằng CloudFormation, bạn phải khai báo từng phần đó riêng.

## Thế mạnh 2: IAM least privilege chỉ một dòng

\`\`\`javascript
const role = new iam.Role(this, 'ReaderRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
bucket.grantRead(role); // CDK tự sinh IAM policy
\`\`\`

\`grantRead\` sinh policy chỉ có quyền đọc, giới hạn đúng vào bucket này. Bạn không cần nhớ danh sách action của S3, và quyền luôn khớp với bucket thật dù tên bucket do CDK tự đặt.

## Thế mạnh 3: một code, nhiều môi trường

Vì là code thật, bạn dùng biến và điều kiện thay vì copy template:

\`\`\`javascript
const isProd = props.stage === 'prod';

new s3.Bucket(this, 'DataBucket', {
  removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: !isProd,
});
\`\`\`

Stage được truyền từ dòng lệnh: \`cdk deploy -c stage=prod\`. Dev dùng \`DESTROY\` để dọn lab bằng một lệnh. Prod dùng \`RETAIN\` để lỡ tay xóa stack cũng không mất dữ liệu. Tên stack chứa stage (\`Lab-dev\`, \`Lab-prod\`) nên hai môi trường độc lập hoàn toàn.

## Thế mạnh 4: kiểm tra bảo mật tự động với cdk-nag

cdk-nag quét template lúc \`cdk synth\` theo bộ luật \`AwsSolutionsChecks\`. Có finding chưa xử lý thì synth thất bại, nên pipeline đỏ trước khi tài nguyên được tạo:

\`\`\`javascript
cdk.Validations.of(app).addPlugins(new AwsSolutionsChecks(app, { verbose: true }));
\`\`\`

Khi một luật báo đúng nhưng bạn có lý do hợp lệ, hãy acknowledge kèm lý do, không tắt cả luật. Ví dụ \`grantRead\` sinh wildcard \`s3:List*\`, bị luật IAM5 báo. Đây là chủ ý (chỉ đọc, trong một bucket):

\`\`\`javascript
Validations.of(role).acknowledge({
  id: 'AwsSolutions-IAM5[Action::s3:List*]',
  reason: 'Wildcard sinh từ bucket.grantRead(): read-only, giới hạn trong DataBucket.',
});
\`\`\`

Lưu ý với cdk-nag v3: mỗi finding phải acknowledge riêng, không còn \`NagSuppressions\` như bản cũ. Hơi dài dòng, nhưng buộc bạn đọc từng finding.

## Thế mạnh 5: test hạ tầng như test code

Test chạy local, không cần AWS credentials. CDK dựng stack trong bộ nhớ, sinh template, rồi bạn assert:

\`\`\`javascript
const template = Template.fromStack(stack);

test('enforces SSL via bucket policy', () => {
  template.hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: 'Deny',
          Condition: { Bool: { 'aws:SecureTransport': 'false' } },
        }),
      ]),
    },
  });
});
\`\`\`

Test đáng giá nhất là test phủ định: khẳng định \`ReaderRole\` không có action ghi hay xóa. Nếu ai đó đổi \`grantRead\` thành \`grantReadWrite\`, test đỏ ngay trong PR. cdk-nag bắt lỗi cấu hình chung, còn unit test bắt quy tắc riêng của bạn. Hai thứ bổ sung cho nhau.

## Thế mạnh 6: CI/CD không cần access key

\`\`\`
PR   -> validate (test + cdk-nag) -> cdk diff
main -> validate -> deploy-dev -> deploy-prod (cần người duyệt)
\`\`\`

Pipeline GitHub Actions dùng OIDC: workflow xin token ngắn hạn rồi assume một IAM role, nên không có access key dài hạn nào nằm trong GitHub. Prod được chặn bởi **Required reviewers** của GitHub Environment. Nếu quên bật, pipeline sẽ deploy prod ngay sau dev.

## Cạm bẫy: Budget luôn hiện $0

CDK chưa có L2 construct cho AWS Budgets, nên phải dùng L1 \`CfnBudget\` (map 1-1 với CloudFormation, dài dòng hơn). Budget lọc theo tag \`Project=cdk-lab\` để chỉ tính chi phí của lab:

\`\`\`javascript
costFilters: { TagKeyValue: ['user:Project$cdk-lab'] },
\`\`\`

Cạm bẫy: tag \`Project\` phải được bật làm *cost allocation tag* trong Billing console, và dữ liệu chỉ có sau khoảng 24 giờ. Quên bước này thì budget luôn hiện $0 và không bao giờ cảnh báo, trong khi mọi thứ trông vẫn bình thường. Nhớ cũng truyền email thật bằng \`-c alertEmail=<email>\`, vì deploy bằng email giả thì cảnh báo không tới bạn.

## Chạy thử, không tốn tiền

\`\`\`bash
npm ci
npm test
npx cdk synth -c stage=dev -c alertEmail=you@example.com
\`\`\`

Bài tập hay: bỏ \`enforceSSL: true\` rồi chạy lại \`cdk synth\` để xem cdk-nag chặn thế nào. Chỉ \`cdk deploy\` mới tạo tài nguyên thật: chỉ deploy \`dev\` từ máy local, và dọn bằng \`cdk destroy -c stage=dev\`.

## Ưu điểm, nhược điểm và chi phí

\`\`\`
Ưu điểm                                    Nhược điểm
Default an toàn, grant() cho IAM           Phải hiểu CloudFormation phía dưới khi debug
Một code, nhiều môi trường                 Một số dịch vụ chỉ có L1, code dài (như Budget)
Test + cdk-nag chặn lỗi trước deploy       Chỉ bắt được các case đã có luật hoặc test
CI dùng OIDC, không có key dài hạn         Setup OIDC role và Environments ban đầu mất công
\`\`\`

\`\`\`
Hạng mục                   Chi phí tham khảo
S3 + Budgets ở quy mô lab  Gần như $0/tháng (kiểm tra lại trang pricing)
Công sức dựng lab          Khoảng 1-2 ngày nếu chưa quen CDK và OIDC
Rủi ro lớn nhất            Quên cdk destroy. Hãy tạo Budget $5 trong account sandbox trước
\`\`\`

## Key Takeaways

1. CDK sinh template CloudFormation, nên test, cdk-nag và \`cdk diff\` chạy được trước khi tốn tiền.
2. L2 construct cho default an toàn, và \`grant*()\` cho IAM least privilege chỉ một dòng.
3. Code thật nghĩa là dùng biến và điều kiện để tách dev/prod, đặc biệt \`RemovalPolicy\`.
4. cdk-nag chặn lỗi bảo mật chung, unit test chặn quy tắc riêng. Acknowledge luôn kèm lý do.
5. CI/CD dùng OIDC thay access key, và bật Required reviewers trước prod.
6. Budget lọc theo tag chỉ hoạt động sau khi bật cost allocation tag.
    `
  },
  {
    id: 16,
    slug: 'ecs-task-definition-service-fargate-spot',
    title: "ECS cơ bản: Task Definition, Service, Fargate vs EC2 và Spot cho worker",
    category: "Cloud Infrastructure",
    difficulty: "Intermediate",
    readTime: "7 min read",
    date: "2026-11-22",
    featured: false,
    excerpt: "Bốn khái niệm cốt lõi của Amazon ECS: Task Definition, Service, Fargate vs EC2, và vì sao worker nên chạy Spot còn API chạy On-Demand. Kèm capacity provider, xử lý SIGTERM và cạm bẫy weight không phải fallback.",
    tags: ["AWS", "ECS", "Fargate", "Spot", "Capacity Provider", "CDK"],
    content: `
# ECS cơ bản: Task Definition, Service, Fargate vs EC2 và Spot cho worker

Amazon ECS có nhiều thuật ngữ dễ lẫn. Bài này gom lại bốn ý cốt lõi và một cấu hình thực tế: API chạy On-Demand, worker chạy Spot.

## 1. Task Definition: bản thiết kế

Task Definition mô tả container chạy như thế nào: image, CPU, memory, port, env vars, IAM role, logging. Nó chỉ là bản mô tả, chưa chạy gì cả. Có thể hình dung nó như \`Dockerfile\` cộng \`docker-compose\` cho ECS.

\`\`\`json
{
  "family": "api",
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "api",
    "image": "123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/api:1.0.0",
    "portMappings": [{ "containerPort": 3000 }]
  }]
}
\`\`\`

## 2. Service: giữ task luôn chạy

Service đọc Task Definition và đảm bảo luôn có N task đang chạy. Task chết thì Service tự tạo task mới. Service cũng lo rolling deploy và gắn task vào ALB.

\`\`\`
desiredCount = 3  ->  Service luôn giữ 3 task
\`\`\`

Quan hệ giữa ba thứ:

\`\`\`
Task Definition (what)  ->  Service (keep alive)  ->  Tasks (running containers)
\`\`\`

## 3. Fargate vs EC2 (launch type)

\`\`\`
                Fargate                          EC2
Ý nghĩa         Serverless, không quản lý server Tự quản lý EC2 instances
Ưu điểm         Ít vận hành, scale đơn giản      Kiểm soát cao: instance type, GPU, binpack, daemon
Nhược điểm      Giá mỗi vCPU cao hơn, ít tùy chỉnh Phải patch AMI, quản lý capacity
Hợp với         Team nhỏ, workload thay đổi      Workload lớn, ổn định, cần tối ưu chi phí
\`\`\`

Nói gọn: muốn ít vận hành thì chọn Fargate, muốn kiểm soát và tối ưu chi phí thì chọn EC2.

## 4. Spot cho worker, On-Demand cho API

Đây là câu hỏi về purchase option, tức là cách mua capacity, và độc lập với việc chọn Fargate hay EC2.

\`\`\`
Spot        Rẻ hơn nhiều (Fargate Spot tới khoảng 70%, EC2 Spot có thể tới khoảng 90%),
            nhưng AWS có thể thu hồi sau cảnh báo 2 phút
On-Demand   Giá đầy đủ, ổn định, không bị thu hồi
\`\`\`

Vì sao chia như vậy:

- API nhận request trực tiếp từ user. Task bị thu hồi thì request có thể lỗi hoặc latency tăng, nên cần ổn định: On-Demand.
- Worker xử lý job từ queue (SQS, BullMQ). Bị thu hồi thì job quay lại queue và worker khác xử lý tiếp, nên chịu được gián đoạn: Spot.

Điều kiện để worker chạy Spot an toàn là job phải idempotent và retry được. Worker cũng phải bắt \`SIGTERM\` để dừng gọn:

\`\`\`javascript
process.on('SIGTERM', async () => {
  await worker.close(); // finish current job, stop taking new ones
  process.exit(0);
});
\`\`\`

Đặt \`stopTimeout\` trong container definition đủ lớn để job đang chạy kịp xong. Trên Fargate giá trị tối đa là 120 giây.

## Cấu hình thực tế với Capacity Provider

\`\`\`
api-service     ->  capacity provider: On-Demand (base=2)
worker-service  ->  capacity provider: Spot (weight=4) + On-Demand (weight=1)
\`\`\`

## Ví dụ CDK (Fargate)

Kiến trúc của ví dụ: user vào ALB ở public subnet, ALB chuyển request tới api-service. Worker lấy job từ SQS queue (kèm DLQ để giữ job lỗi). Cả hai service chạy trong private subnet của cùng một cluster.

![Kiến trúc ECS: ALB và api-service On-Demand, SQS và worker-service Spot](/images/ecs-architecture.svg)

Cluster bật Fargate capacity providers, API dùng \`FARGATE\`, worker dùng \`FARGATE_SPOT\` là chính:

\`\`\`javascript
const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

new ecs.FargateService(this, 'ApiService', {
  cluster,
  taskDefinition: apiTaskDef,
  desiredCount: 2,
  capacityProviderStrategies: [{ capacityProvider: 'FARGATE', weight: 1 }],
});

new ecs.FargateService(this, 'WorkerService', {
  cluster,
  taskDefinition: workerTaskDef,
  desiredCount: 3,
  capacityProviderStrategies: [
    { capacityProvider: 'FARGATE_SPOT', weight: 4 },
    { capacityProvider: 'FARGATE', weight: 1 },
  ],
});
\`\`\`

Cách map khái niệm sang CDK:

\`\`\`
Task Definition (blueprint)    FargateTaskDefinition + addContainer
Service (keep tasks running)   FargateService với desiredCount
Fargate vs EC2                 Fargate, cluster bật enableFargateCapacityProviders
On-Demand cho API              capacityProvider: 'FARGATE'
Spot cho worker                FARGATE_SPOT weight 4, FARGATE weight 1
\`\`\`

Chạy thử:

\`\`\`bash
npm i aws-cdk-lib constructs
npx cdk bootstrap
npx cdk diff
npx cdk deploy
\`\`\`

## base và weight: chia task giữa các provider

Capacity provider strategy là một danh sách provider. Mỗi provider có hai tham số quyết định ECS đặt task ở đâu.

\`\`\`
base     Số task TỐI THIỂU chạy trên provider này. Được đặt trước.
weight   Tỷ lệ chia các task CÒN LẠI sau khi đã đặt đủ base.
\`\`\`

ECS xử lý theo hai bước:

\`\`\`
Bước 1: đặt đủ số task của base (mặc định base = 0)
Bước 2: chia phần task còn lại theo tỷ lệ weight
\`\`\`

### weight: tỷ lệ, không phải số lượng

\`\`\`
FARGATE_SPOT weight 4
FARGATE      weight 1
tổng = 5   ->   Spot 4/5 = 80%,  On-Demand 1/5 = 20%
\`\`\`

Với \`desiredCount = 10\` thì khoảng 8 task Spot và 2 task On-Demand. Với \`desiredCount = 5\` thì khoảng 4 và 1.

- \`4:1\` và \`8:2\` cho kết quả giống nhau, vì chỉ tỷ lệ mới có ý nghĩa.
- Số task là số nguyên nên tỷ lệ chỉ gần đúng. Với \`desiredCount = 3\` kết quả có thể lệch một task.
- \`weight: 0\` nghĩa là provider đó không nhận thêm task nào ngoài phần \`base\`.

### base: đảm bảo mức tối thiểu

\`\`\`javascript
capacityProviderStrategies: [
  { capacityProvider: 'FARGATE', base: 2, weight: 0 },
  { capacityProvider: 'FARGATE_SPOT', weight: 1 },
]
\`\`\`

Với \`desiredCount = 10\`: 2 task đầu luôn chạy On-Demand (\`base\`). 8 task còn lại chia theo weight 0:1, tức là cả 8 chạy Spot.

Chỉ một provider trong strategy được đặt \`base\`.

### Khi nào dùng cái nào

\`\`\`
Mục tiêu                                        Cách dùng
Chỉ cần rẻ, chia tỷ lệ chi phí/rủi ro           Chỉ dùng weight (ví dụ Spot 4, On-Demand 1)
Luôn có ít nhất N task ổn định                  base trên FARGATE, weight 0 cho FARGATE
Phần dư chạy Spot cho rẻ                        weight cho FARGATE_SPOT
Service chỉ cần một loại capacity               Một provider, weight 1 (như API ở trên)
\`\`\`

Gợi ý thực tế:

- API: chỉ \`FARGATE\`. Muốn chắc chắn có tối thiểu 2 task sống thì \`base: 2\`, hoặc đơn giản đặt \`desiredCount: 2\`.
- Worker nhẹ, job ngắn, retry tốt: chỉ weight, ví dụ Spot 4 và On-Demand 1. Phần On-Demand là đệm khi Spot bị thu hồi hàng loạt.
- Worker quan trọng hơn (job dài, khó retry): dùng \`base\` cho On-Demand để luôn có số worker tối thiểu, phần scale thêm mới chạy Spot.

## Lưu ý quan trọng

1. weight không phải fallback thật. Nó không có nghĩa "dùng Spot trước, hết Spot mới sang On-Demand". Cả hai provider luôn được dùng theo tỷ lệ.
2. Fargate Spot không tự chuyển sang On-Demand khi hết capacity. ECS chỉ thử đặt task lại (retry placement). Muốn có mức tối thiểu chắc chắn thì phải dùng \`base\`.
3. Graceful shutdown: worker phải bắt \`SIGTERM\`, \`stopTimeout\` đủ lớn, và job phải idempotent.
4. Muốn dùng EC2 Spot với binpack thì thay Fargate bằng \`AutoScalingGroup\` cộng \`AsgCapacityProvider\` và dùng \`Ec2Service\`. Code dài hơn và bạn phải tự patch AMI.

## Trade-off và chi phí

\`\`\`
                 Ưu điểm                       Nhược điểm
Fargate          Ít vận hành, không patch AMI  Giá mỗi vCPU cao hơn EC2
Fargate Spot     Rẻ hơn khoảng 70%             Có thể bị thu hồi, chỉ hợp worker stateless
\`\`\`

\`\`\`
Hạng mục                 Chi phí tham khảo (ap-northeast-1, chạy 24/7)
NAT Gateway              Khoảng $35-40/tháng
ALB                      Khoảng $20/tháng
\`\`\`

Hai khoản này thường lớn hơn tiền task nhỏ. Hãy kiểm tra lại trang pricing trước khi quyết định. Với môi trường DEV/UAT, nên đưa \`desiredCount\` về 0 ngoài giờ làm việc.

## Key Takeaways

1. Task Definition mô tả cái gì chạy, Service giữ nó luôn chạy.
2. Fargate hay EC2 quyết định chạy ở đâu, Spot hay On-Demand quyết định trả bao nhiêu và chịu rủi ro nào.
3. API cần ổn định nên chạy On-Demand, worker idempotent chạy Spot.
4. Weight chỉ là tỷ lệ, muốn đảm bảo số task On-Demand tối thiểu thì dùng \`base\`.
5. Spot chỉ an toàn khi worker bắt \`SIGTERM\` và \`stopTimeout\` đủ lớn.
    `
  }
];

export const getBlogPostBySlug = (slug: string | undefined): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

/** Legacy URLs were /blog/{numeric id}; used to redirect old links to the slug URL. */
export const getBlogPostById = (id: string | undefined): BlogPost | undefined =>
  blogPosts.find((post) => String(post.id) === id);
