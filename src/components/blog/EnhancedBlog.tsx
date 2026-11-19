import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Search, 
  Tag,
  ArrowRight,
  Users,
  Heart,
  MessageCircle,
  Star,
  Filter,
  Grid3X3,
  List,
  Zap,
  Target,
  Award,
  Code,
  Database,
  Cloud,
  Shield
} from 'lucide-react';
import { 
  AnimatedBackground, 
  TechBadge, 
  LoadingSkeleton, 
  StatsCard, 
  InteractiveButton, 
  CategoryFilter, 
  ViewToggle, 
  EngagementMetrics,
  categoryColors
} from '../visual/VisualComponents';

interface BlogPost {
  id: number;
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

const blogPosts: BlogPost[] = [
  {
    id: 2,
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
  }
];

const categories = ['DevOps', 'Cloud Infrastructure', 'Full-Stack'];

const EnhancedBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Close the modal with the Esc key, same as clicking the X button
  useEffect(() => {
    if (selectedPost === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [selectedCategory, searchTerm]);

  const featuredPosts = blogPosts.filter(post => post.featured);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const avgReadMinutes = Math.round(
    blogPosts.reduce((total, post) => total + parseInt(post.readTime, 10), 0) / blogPosts.length
  );

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent font-mono">
            docker run -it --rm node bash -c 'echo "tech blog"'
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and best practices from the world of DevOps, Cloud Infrastructure, and Full-Stack Development
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <StatsCard
            title="Total Articles"
            value={blogPosts.length}
            icon={<BookOpen className="w-6 h-6" />}
            color="completed"
          />
          <StatsCard
            title="Categories"
            value={new Set(blogPosts.map((post) => post.category)).size}
            icon={<Tag className="w-6 h-6" />}
            color="completed"
          />
          <StatsCard
            title="Featured"
            value={featuredPosts.length}
            icon={<Star className="w-6 h-6" />}
            color="completed"
          />
          <StatsCard
            title="Avg. Read Time"
            value={`${avgReadMinutes} min`}
            icon={<Clock className="w-6 h-6" />}
            color="completed"
          />
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Featured Articles
            </h2>
          
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handlePostClick(post)}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TechBadge name={post.category} category={post.category} size="sm" />
                      <span className="text-xs text-yellow-400 font-medium">⭐ Featured</span>
                    </div>
                  
                    <h3 className="text-xl font-bold text-neutral-200 mb-3 group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>
                  
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  
                    <div className="flex items-center justify-between">
                      <EngagementMetrics
                        featured={post.featured}
                      />
                    
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.readTime}</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-neutral-200 placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <ViewToggle view={view} onViewChange={setView} />
        </motion.div>

        {/* Blog Posts Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchTerm}-${view}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={view === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handlePostClick(post)}
                className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer group hover:border-green-400 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <TechBadge name={post.category} category={post.category} size="sm" />
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        post.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {post.difficulty}
                      </span>
                      {post.featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-200 mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <EngagementMetrics
                    featured={post.featured}
                  />
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{post.readTime}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-400/30 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            STAY_UPDATED.EXE
          </h2>
          <p className="text-green-200 mb-6 max-w-2xl mx-auto">
            Subscribe to get the latest DevOps insights, tutorials, and best practices delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-neutral-200 placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
            <InteractiveButton variant="primary">
              Subscribe
            </InteractiveButton>
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
            No spam, unsubscribe at any time.
          </p>
        </motion.section>

        {/* Blog Post Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TechBadge name={selectedPost.category} category={selectedPost.category} size="sm" />
                      <span className={`px-2 py-1 text-xs rounded ${
                        selectedPost.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        selectedPost.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedPost.difficulty}
                      </span>
                      {selectedPost.featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-400 hover:text-neutral-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-200 mb-2">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  <div className="prose prose-invert prose-green max-w-none">
                    {(() => {
                      const lines = selectedPost.content.split('\n');
                      const elements: React.ReactNode[] = [];
                      let i = 0;
                      while (i < lines.length) {
                        const line = lines[i];
                        if (line.startsWith('```')) {
                          const codeLines: string[] = [];
                          i++;
                          while (i < lines.length && !lines[i].startsWith('```')) {
                            codeLines.push(lines[i]);
                            i++;
                          }
                          i++; // skip closing fence
                          elements.push(
                            <pre key={elements.length} className="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
                              <code className="text-green-400 whitespace-pre">{codeLines.join('\n')}</code>
                            </pre>
                          );
                          continue;
                        } else if (line.startsWith('# ')) {
                          elements.push(<h1 key={elements.length} className="text-3xl font-bold text-green-400 mb-4">{line.substring(2)}</h1>);
                        } else if (line.startsWith('## ')) {
                          elements.push(<h2 key={elements.length} className="text-2xl font-bold text-green-400 mb-3 mt-6">{line.substring(3)}</h2>);
                        } else if (line.startsWith('### ')) {
                          elements.push(<h3 key={elements.length} className="text-xl font-bold text-green-400 mb-2 mt-4">{line.substring(4)}</h3>);
                        } else if (line.trim()) {
                          elements.push(<p key={elements.length} className="text-gray-300 leading-relaxed mb-4">{line}</p>);
                        } else {
                          elements.push(<br key={elements.length} />);
                        }
                        i++;
                      }
                      return elements;
                    })()}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-800 text-green-400 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedBackground>
  );
};

export default EnhancedBlog;