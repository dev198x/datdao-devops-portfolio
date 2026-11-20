// Database schema section of the "Customer Support Chatbot — RAG + LLM" project.
// Source: the chatbot repo's migrations (0001-0010) and docs/DATABASE.md, docs/DATA-FLOW.md.
// Schema only: no real customer data, no credentials. Example rows come from a local run with fake data.

import type { CodeExample } from './portfolio';

export interface DbColumn {
  name: string;
  type: string;
  note: string;
}

export interface DbTable {
  name: string;
  group: string;
  purpose: string;
  columns: DbColumn[];
  notes?: string[];
}

export type StoreKind = 'postgres' | 'redis' | 'memory' | 'observability';
export type StoreAccess = 'read' | 'write';

export interface FlowStore {
  kind: StoreKind;
  /** Table or key, e.g. "messages" or "pii:<conversationId>". */
  label: string;
  access: StoreAccess;
}

export interface FlowStep {
  step: string;
  action: string;
  stores: FlowStore[];
}

export interface FlowScenario {
  scenario: string;
  conversations: string;
  messages: string;
  llmCalls: string;
  orders: string;
}

export interface DatabaseSection {
  engine: string;
  summary: string;
  principles: string[];
  relations: string;
  relationNotes: string[];
  tables: DbTable[];
  /** Optional end-to-end data flow (chatbot-specific columns); omit for projects without it. */
  flow?: FlowStep[];
  scenarios?: FlowScenario[];
  scenariosNote?: string;
  ddl: CodeExample[];
  queries: CodeExample[];
  limitations: string[];
}

export const CHATBOT_DATABASE: DatabaseSection = {
  engine: 'PostgreSQL 16 + pgvector (migrations bằng node-pg-migrate)',
  summary:
    'Postgres lưu dữ liệu nghiệp vụ của chatbot: hội thoại và tin nhắn (đã che PII), chi phí từng lần gọi LLM, đơn hàng để tool tra cứu, và kho tài liệu chính sách cho RAG. Có 11 bảng nghiệp vụ chia thành 4 nhóm, cộng bảng hệ thống pgmigrations. Redis giữ phần dữ liệu tạm (PII gốc, bộ đếm giới hạn), còn log và trace đi sang Loki/Tempo.',
  principles: [
    'Không lưu PII dạng gốc: messages.content_masked chỉ chứa văn bản đã che (<PHONE_1>, <EMAIL_1>, <ADDRESS_1>). Bản gốc nằm tạm trong Redis, mã hoá AES-GCM, hết hạn sau 30 phút',
    'Quyền sở hữu nằm ở lớp truy vấn: mọi câu SELECT theo hội thoại hoặc đơn hàng đều lọc theo chủ sở hữu, và "không có" với "không phải của bạn" trả về cùng một kết quả (chống IDOR)',
    'Bảng log chỉ có số liệu và mã cố định: llm_calls không có prompt hay câu trả lời, handoff_tickets không chép nội dung hội thoại, các bảng audit không có tên file hay tên khách',
    'Schema chỉ đổi qua migration mới (0001 đến 0010); không sửa migration đã chạy. Dữ liệu trong repo là dữ liệu giả',
  ],
  relations: `customers 1 ──< orders                    (orders.customer_id  FK -> customers.id)
customers 1 ──< customer_status_audit     (FK)

conversations 1 ──< messages              (messages.conversation_id FK)
messages      1 ──  message_feedback      (message_id UNIQUE: tối đa 1 đánh giá / tin nhắn)
conversations 1 ──< llm_calls             (FK)
conversations 1 ──< handoff_tickets       (FK, tối đa 1 ticket open / hội thoại)

rag_documents 1 ──< rag_chunks            (FK (doc_id, version), xoá tài liệu thì xoá luôn đoạn)
rag_ingest_audit                          (không FK: lịch sử còn nguyên khi xoá tài liệu)

trace_id nối messages, llm_calls, handoff_tickets với log và trace (không có FK)`,
  relationNotes: [
    'conversations.customer_id và handoff_tickets.customer_id cố ý không có khoá ngoại tới customers, để lịch sử còn nguyên khi một khách bị khoá (disabled)',
    'Một trace_id là một lượt hỏi đáp: tin nhắn của khách, câu trả lời và mọi lần gọi LLM của lượt đó dùng chung trace_id',
  ],
  tables: [
    {
      name: 'conversations',
      group: 'Hội thoại',
      purpose: 'Một cuộc trò chuyện. Thuộc về đúng một chủ: khách đã đăng nhập hoặc một phiên ẩn danh.',
      columns: [
        { name: 'id', type: 'UUID PK', note: 'Mã hội thoại, server sinh; trả về trình duyệt là conversationId' },
        { name: 'customer_id', type: 'UUID NULL', note: 'Mã khách đã đăng nhập (sub của JWT); NULL khi ẩn danh' },
        { name: 'session_id', type: 'TEXT NULL', note: 'Phiên ẩn danh từ cookie sid đã ký; NULL khi đã đăng nhập' },
        { name: 'auth_level', type: 'TEXT', note: 'anonymous | verified | verified_strong' },
        { name: 'handled_by', type: 'TEXT', note: 'bot (mặc định) | human. Khi là human, bot im lặng' },
        { name: 'last_active_at', type: 'TIMESTAMPTZ', note: 'Lần hoạt động gần nhất' },
      ],
      notes: ['CHECK: phải có customer_id hoặc session_id (không có hội thoại vô chủ)'],
    },
    {
      name: 'messages',
      group: 'Hội thoại',
      purpose: 'Từng tin nhắn. Một lượt hỏi đáp thường tạo 2 dòng: user và assistant.',
      columns: [
        { name: 'conversation_id', type: 'UUID FK', note: 'Hội thoại chứa tin nhắn' },
        { name: 'trace_id', type: 'TEXT', note: 'Mã lượt hỏi đáp, dùng để tra ngược từ log và trace' },
        { name: 'role', type: 'TEXT', note: 'user | assistant' },
        { name: 'content_masked', type: 'TEXT', note: 'Nội dung đã che PII. Không có cột lưu bản gốc' },
        { name: 'created_at', type: 'TIMESTAMPTZ', note: 'Dùng để sắp xếp; index (conversation_id, created_at)' },
      ],
      notes: ['Tin của khách được lưu trước khi có câu trả lời, nên lượt lỗi hoặc bị chặn có thể chỉ có dòng user'],
    },
    {
      name: 'message_feedback',
      group: 'Hội thoại',
      purpose: 'Khách đánh giá 👍/👎 một câu trả lời của bot. Một dòng cho mỗi tin nhắn.',
      columns: [
        { name: 'message_id', type: 'UUID FK UNIQUE', note: 'Tin nhắn được đánh giá' },
        { name: 'rating', type: 'TEXT', note: 'up | down' },
        { name: 'reason', type: 'TEXT NULL', note: 'wrong | not_helpful | unsafe | other (chỉ khi rating = down)' },
        { name: 'review_status', type: 'TEXT', note: 'new | accepted | rejected: người đọc 👎 rồi mới quyết định thành eval case' },
      ],
      notes: ['Không có ô nhập chữ tự do và không chép customer_id, nên không thêm chỗ chứa dữ liệu cá nhân'],
    },
    {
      name: 'handoff_tickets',
      group: 'Hội thoại',
      purpose: 'Yêu cầu chuyển cuộc trò chuyện cho nhân viên. Ticket chỉ chứa mã, lý do cố định và thời điểm.',
      columns: [
        { name: 'conversation_id', type: 'UUID FK', note: 'Hội thoại cần người tiếp quản; nhân viên đọc messages (đã che) theo mã này' },
        { name: 'reason', type: 'TEXT', note: 'customer_request | output_blocked | tool_limit' },
        { name: 'status', type: 'TEXT', note: 'open (mặc định) | closed' },
        { name: 'closed_at', type: 'TIMESTAMPTZ NULL', note: 'Có giá trị khi và chỉ khi status = closed' },
        { name: 'notified_at', type: 'TIMESTAMPTZ NULL', note: 'Lúc báo nhân viên qua Slack; NULL = chưa ai được báo' },
        { name: 'notified_channel, notified_ts', type: 'TEXT NULL', note: 'Tin nhắn Slack đã báo ticket, để đóng ticket bằng reaction' },
        { name: 'closed_by', type: 'TEXT NULL', note: 'Mã băm của người đóng (không lưu Slack id thật)' },
      ],
      notes: [
        'Unique index một phần: tối đa một ticket open cho mỗi hội thoại, nên khách xin nhiều lần hay request gửi lặp cũng không tạo ticket thứ hai',
        'Tạo ticket và đặt conversations.handled_by = human chạy trong một câu SQL, nên hai thứ không thể lệch nhau',
      ],
    },
    {
      name: 'llm_calls',
      group: 'Chi phí',
      purpose: 'Nhật ký mỗi lần gọi LLM: chỉ có số liệu, không có prompt hay câu trả lời. Lượt có tool gọi LLM hai lần nên có hai dòng.',
      columns: [
        { name: 'trace_id, conversation_id', type: 'TEXT / UUID FK', note: 'Lượt hỏi đáp và hội thoại chứa lần gọi này' },
        { name: 'step', type: 'TEXT', note: 'main (trả lời) | guard (phân loại injection); route, judge là giá trị dự phòng' },
        { name: 'model, prompt_version', type: 'TEXT', note: 'Model thật và phiên bản prompt (ví dụ chat-v10) để so sánh chất lượng và chi phí' },
        { name: 'input_tokens', type: 'INT', note: 'Token vào không nằm trong cache' },
        { name: 'cache_read_tokens, cache_write_tokens', type: 'INT', note: 'Token đọc từ / ghi vào prompt cache' },
        { name: 'output_tokens', type: 'INT', note: 'Token model sinh ra' },
        { name: 'cost_usd', type: 'NUMERIC(10,6)', note: 'Chi phí lần gọi, tính từ số token và bảng giá' },
        { name: 'latency_ms', type: 'INT', note: 'Thời gian đến khi có kết quả đầy đủ' },
      ],
      notes: ['SUM(cost_usd) từ 00:00 UTC là căn cứ của trần chi phí ngày: vượt ngưỡng thì app ngừng gọi model'],
    },
    {
      name: 'customers',
      group: 'Nghiệp vụ',
      purpose: 'Chỉ để biết khách có tồn tại và đang bật hay bị khoá. Không có email, số điện thoại, CCCD hay địa chỉ.',
      columns: [
        { name: 'id', type: 'UUID PK', note: 'Trùng customer_id trong token và trong orders' },
        { name: 'display_name', type: 'TEXT', note: 'Nhãn hiển thị 1 đến 100 ký tự, không bắt buộc là tên thật' },
        { name: 'status', type: 'TEXT', note: 'active (mặc định) | disabled' },
      ],
      notes: ['Khách bị khoá: mọi tool chặn ở lần gọi kế tiếp (đọc DB mỗi lần); khách chưa có dòng cũng bị chặn như bị khoá'],
    },
    {
      name: 'customer_status_audit',
      group: 'Nghiệp vụ',
      purpose: 'Mỗi lần tạo, bật hoặc khoá khách để lại một dòng: ai làm, lúc nào, từ trạng thái nào sang trạng thái nào.',
      columns: [
        { name: 'customer_id', type: 'UUID FK', note: 'Khách bị đổi trạng thái' },
        { name: 'action', type: 'TEXT', note: 'create | enable | disable' },
        { name: 'from_status, to_status', type: 'TEXT', note: 'from_status là NULL khi tạo mới' },
        { name: 'actor', type: 'TEXT', note: 'User hệ điều hành chạy script quản trị' },
      ],
      notes: ['Không chép display_name để nhật ký không chứa nhãn của khách'],
    },
    {
      name: 'orders',
      group: 'Nghiệp vụ',
      purpose: 'Nguồn dữ liệu cho tool get_order và rule bảo hành. Không có địa chỉ, số điện thoại hay thông tin cá nhân.',
      columns: [
        { name: 'order_number', type: 'TEXT UNIQUE', note: 'Số đơn khách nhắc tới, 4 đến 12 chữ số (ví dụ 8812)' },
        { name: 'customer_id', type: 'UUID FK', note: 'Chủ đơn. Tool luôn lọc theo cột này, lấy từ ngữ cảnh đăng nhập chứ không từ lời model hay lời khách' },
        { name: 'product_name', type: 'TEXT', note: 'Tên hiển thị của sản phẩm' },
        { name: 'product_category', type: 'TEXT NULL', note: 'phone | laptop | other | NULL = chưa biết (rule bảo hành từ chối đoán)' },
        { name: 'status', type: 'TEXT', note: 'pending | paid | shipped | delivered | cancelled | returned' },
        { name: 'purchased_at', type: 'TIMESTAMPTZ', note: 'Rule bảo hành tính hạn từ ngày này (code quyết định, LLM chỉ diễn giải)' },
        { name: 'total_vnd', type: 'BIGINT', note: 'Tổng tiền, đơn vị đồng, không âm' },
      ],
    },
    {
      name: 'rag_documents',
      group: 'Kiến thức (RAG)',
      purpose: 'Mỗi dòng là một phiên bản của một tài liệu chính sách. Phiên bản đã nạp là bất biến: chính sách đổi thì thêm phiên bản mới.',
      columns: [
        { name: 'doc_id, version', type: 'TEXT PK', note: 'Cặp doc_id@version chính là nhãn trích dẫn trong câu trả lời, ví dụ [shipping@v1]' },
        { name: 'title', type: 'TEXT', note: 'Tiêu đề tài liệu' },
        { name: 'product, region', type: 'TEXT', note: 'Phạm vi áp dụng (mặc định all); hiện mới là metadata, tìm kiếm chưa lọc theo' },
        { name: 'effective_from, effective_to', type: 'DATE', note: 'Khoảng hiệu lực; effective_to không tính ngày đó, NULL = còn hiệu lực' },
        { name: 'content_hash', type: 'TEXT', note: 'SHA-256 của tiêu đề và nội dung, để phát hiện tài liệu đã bị sửa' },
      ],
      notes: ['Khi tìm kiếm chỉ lấy phiên bản có hiệu lực tại ngày hôm nay; hai phiên bản của một tài liệu được nối tiếp nhau nhưng không được chồng lên nhau'],
    },
    {
      name: 'rag_chunks',
      group: 'Kiến thức (RAG)',
      purpose: 'Mỗi tài liệu được cắt thành các đoạn. Tìm kiếm chạy trên bảng này và kết hợp hai cách: từ khoá và vector.',
      columns: [
        { name: 'doc_id, version, ordinal', type: 'TEXT / INT', note: 'Đoạn thuộc phiên bản nào và đứng thứ mấy; (doc_id, version, ordinal) là duy nhất' },
        { name: 'text', type: 'TEXT', note: 'Nội dung đoạn kèm đường dẫn mục; phần này được đưa cho model làm tài liệu tham khảo' },
        { name: 'search_text', type: 'TEXT', note: 'Bản chữ thường không dấu, để tìm được cả khi khách gõ tiếng Việt có hoặc không dấu' },
        { name: 'tsv', type: 'TSVECTOR (generated)', note: 'to_tsvector(simple, search_text), có chỉ mục GIN cho tìm từ khoá' },
        { name: 'embedding', type: 'VECTOR(256)', note: 'Vector của đoạn, có chỉ mục HNSW (cosine) cho tìm theo độ giống' },
        { name: 'embedding_model', type: 'TEXT', note: 'Model tạo vector, để biết khi nào đổi model và cần index lại' },
      ],
    },
    {
      name: 'rag_ingest_audit',
      group: 'Kiến thức (RAG)',
      purpose: 'Mỗi lần upload tài liệu qua trang quản trị để lại một dòng, kể cả khi file bị từ chối.',
      columns: [
        { name: 'doc_id, version, content_hash', type: 'TEXT NULL', note: 'Tài liệu nào (trống khi file hỏng đến mức không đọc được mã)' },
        { name: 'outcome', type: 'TEXT', note: 'inserted | unchanged | metadata_updated | refused' },
        { name: 'chunk_count, warning_count', type: 'INT', note: 'Số đoạn tạo ra, số cảnh báo' },
        { name: 'ended_versions', type: 'TEXT[]', note: 'Các bản cũ bị kết thúc hiệu lực cùng lúc' },
        { name: 'refused_codes', type: 'TEXT[]', note: 'Mã lỗi khi bị từ chối, ví dụ injection, secret, overlap' },
      ],
      notes: ['Không lưu nội dung hay tên file; không có khoá ngoại nên xoá tài liệu không xoá lịch sử'],
    },
  ],
  flow: [
    {
      step: '1. Request đến cổng (S0)',
      action: 'Tạo traceId cho cả lượt, giới hạn tốc độ theo IP (60 lần/phút) và hạn mức ngày (mặc định 30 câu cho khách ẩn danh, 200 câu cho khách đã đăng nhập). Chưa ghi gì xuống Postgres.',
      stores: [
        { kind: 'redis', label: 'rl:ip:<hash của IP>', access: 'write' },
        { kind: 'redis', label: 'rl:quota-a / rl:quota-c:<hash>', access: 'write' },
      ],
    },
    {
      step: '2. Xác định khách (S1)',
      action: 'Có Bearer JWT thì kiểm tra token và lấy customerId từ sub. Không có thì cấp cookie sid (HttpOnly, Secure, 7 ngày) làm phiên ẩn danh. Token sai trả 401, không bao giờ hạ xuống ẩn danh.',
      stores: [{ kind: 'memory', label: 'RequestContext: authLevel, customerId, scopes', access: 'write' }],
    },
    {
      step: '3. Tìm hoặc tạo hội thoại',
      action: 'Chủ sở hữu là customer_id (đã đăng nhập) hoặc session_id (ẩn danh). Hội thoại mới thì INSERT; dùng lại conversationId thì kiểm tra quyền sở hữu rồi cập nhật last_active_at.',
      stores: [{ kind: 'postgres', label: 'conversations', access: 'write' }],
    },
    {
      step: '4. Che PII (S2)',
      action: 'Số điện thoại, email, địa chỉ trong câu hỏi được đổi thành token như <PHONE_1>. Giá trị thật chỉ nằm trong kho tạm, mã hoá AES-GCM, hết hạn sau 30 phút. Từ đây mọi thứ ghi xuống Postgres chỉ là bản đã che.',
      stores: [{ kind: 'redis', label: 'pii:<conversationId>', access: 'write' }],
    },
    {
      step: '5. Lưu tin nhắn của khách',
      action: 'Kiểm tra nhân viên có đang giữ hội thoại không (handled_by), nạp 12 tin gần nhất làm ngữ cảnh, rồi lưu tin của khách với trace_id của lượt.',
      stores: [
        { kind: 'postgres', label: 'conversations.handled_by', access: 'read' },
        { kind: 'postgres', label: 'messages (lịch sử)', access: 'read' },
        { kind: 'postgres', label: 'messages (role = user)', access: 'write' },
      ],
    },
    {
      step: '6. Chọn đường đi và tìm tài liệu (S3, S4)',
      action: 'Router chọn trả lời cố định, tìm tài liệu (RAG) hoặc hỏi model. Với RAG: tìm kết hợp từ khoá (tsv) và vector (embedding), chỉ trên phiên bản tài liệu còn hiệu lực hôm nay, lấy 5 đoạn.',
      stores: [
        { kind: 'postgres', label: 'rag_chunks', access: 'read' },
        { kind: 'postgres', label: 'rag_documents', access: 'read' },
      ],
    },
    {
      step: '7. Gọi LLM (S5, S6)',
      action: 'Trước khi gọi, cộng chi phí hôm nay để kiểm tra trần ngân sách. Sau mỗi lần gọi ghi một dòng số liệu: token, cache, chi phí, độ trễ.',
      stores: [
        { kind: 'postgres', label: 'llm_calls (tổng chi phí ngày)', access: 'read' },
        { kind: 'postgres', label: 'llm_calls', access: 'write' },
      ],
    },
    {
      step: '8. Tool tra đơn hàng (chỉ khách đã đăng nhập)',
      action: 'Khi model yêu cầu get_order, tool kiểm tra khách còn active rồi chạy truy vấn có customer_id lấy từ ngữ cảnh đăng nhập. Đơn của người khác và đơn không tồn tại cho cùng một kết quả ORDER_NOT_FOUND. Khách ẩn danh không bao giờ được cấp tool.',
      stores: [
        { kind: 'postgres', label: 'customers.status', access: 'read' },
        { kind: 'postgres', label: 'orders (WHERE order_number AND customer_id)', access: 'read' },
      ],
    },
    {
      step: '9. Chốt đầu ra (S7)',
      action: 'Output guard kiểm tra trích dẫn, PII, cam kết và rò prompt. Nếu chặn hoặc khách xin gặp người, tạo ticket và chuyển hội thoại sang nhân viên trong một câu SQL.',
      stores: [
        { kind: 'postgres', label: 'handoff_tickets', access: 'write' },
        { kind: 'postgres', label: 'conversations.handled_by = human', access: 'write' },
      ],
    },
    {
      step: '10. Lưu câu trả lời và trả về',
      action: 'Che PII trong câu trả lời rồi lưu tin của bot; khi hiển thị cho khách thì khôi phục token PII từ kho tạm (nếu chưa hết hạn). Trả JSON gồm conversationId, reply, citations, handoff.',
      stores: [
        { kind: 'postgres', label: 'messages (role = assistant)', access: 'write' },
        { kind: 'redis', label: 'pii:<conversationId>', access: 'read' },
      ],
    },
    {
      step: '11. Sau lượt chat',
      action: 'Khách bấm 👍/👎 thì ghi message_feedback. Ticket mới được báo qua Slack (ghi notified_at, notified_channel, notified_ts); nhân viên đóng ticket bằng reaction thì ghi closed_at và closed_by.',
      stores: [
        { kind: 'postgres', label: 'message_feedback', access: 'write' },
        { kind: 'postgres', label: 'handoff_tickets (notified_*, closed_*)', access: 'write' },
      ],
    },
    {
      step: 'Song song: log và trace',
      action: 'Suốt lượt chat, log và span (chỉ metadata, không có nội dung tin nhắn) đi qua OpenTelemetry Collector tới Loki và Tempo. Nối với Postgres bằng trace_id.',
      stores: [{ kind: 'observability', label: 'Loki (log), Tempo (trace)', access: 'write' }],
    },
  ],
  scenarios: [
    {
      scenario: 'A1. Khách ẩn danh hỏi chính sách giao hàng (RAG)',
      conversations: '1 dòng: anonymous, có session_id, không có customer_id',
      messages: '2 (user, assistant)',
      llmCalls: '1 (main, chat-v10)',
      orders: 'Không đọc',
    },
    {
      scenario: 'A2. Khách ẩn danh hỏi đơn hàng',
      conversations: '1 dòng: anonymous',
      messages: '2 (câu hỏi và câu trả lời cố định bảo đăng nhập)',
      llmCalls: '0 (không gọi model, chi phí 0)',
      orders: 'Không đọc (khách ẩn danh không có tool)',
    },
    {
      scenario: 'B1. Khách đã đăng nhập hỏi đơn hàng của mình (tool)',
      conversations: '1 dòng: verified, có customer_id, không có session_id',
      messages: '2 (user, assistant)',
      llmCalls: '2 (vòng 1 gọi tool, vòng 2 viết câu trả lời)',
      orders: 'Chỉ đọc, luôn lọc theo customer_id',
    },
  ],
  scenariosNote: 'Số liệu lấy từ các lượt chat thật chạy trên môi trường local ngày 2026-11-13 với dữ liệu giả.',
  ddl: [
    {
      language: 'sql',
      caption: 'conversations, messages (rút gọn từ migration 0001, 0005)',
      code: `CREATE TABLE conversations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID,                -- NULL khi ẩn danh
  session_id     TEXT,                -- phiên ẩn danh (cookie sid đã ký)
  auth_level     TEXT NOT NULL CHECK (auth_level IN ('anonymous', 'verified', 'verified_strong')),
  handled_by     TEXT NOT NULL DEFAULT 'bot' CHECK (handled_by IN ('bot', 'human')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversations_owner_chk CHECK (customer_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations (id),
  trace_id        TEXT NOT NULL,      -- một trace = một lượt hỏi đáp
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content_masked  TEXT NOT NULL,      -- chỉ lưu nội dung đã che PII
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX messages_conversation_idx ON messages (conversation_id, created_at);
CREATE INDEX messages_trace_idx        ON messages (trace_id);`,
    },
    {
      language: 'sql',
      caption: 'orders (rút gọn từ migration 0002, 0004, 0007)',
      code: `CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT NOT NULL UNIQUE CHECK (order_number ~ '^[0-9]{4,12}$'),
  customer_id      UUID NOT NULL REFERENCES customers (id),
  product_name     TEXT NOT NULL,
  product_category TEXT CHECK (product_category IN ('phone', 'laptop', 'other')),  -- NULL = chưa biết
  status           TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'returned')),
  purchased_at     TIMESTAMPTZ NOT NULL,
  total_vnd        BIGINT NOT NULL CHECK (total_vnd >= 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_customer_idx ON orders (customer_id);`,
    },
    {
      language: 'sql',
      caption: 'rag_documents, rag_chunks: tìm kết hợp từ khoá và vector (migration 0003)',
      code: `CREATE TABLE rag_documents (
  doc_id         TEXT NOT NULL,
  version        TEXT NOT NULL,
  title          TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to   DATE,                -- không tính ngày này; NULL = còn hiệu lực
  content_hash   TEXT NOT NULL,
  PRIMARY KEY (doc_id, version),
  CONSTRAINT rag_documents_period_chk CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE rag_chunks (
  id              BIGSERIAL PRIMARY KEY,
  doc_id          TEXT NOT NULL,
  version         TEXT NOT NULL,
  ordinal         INT  NOT NULL,
  text            TEXT NOT NULL,
  search_text     TEXT NOT NULL,      -- chữ thường, không dấu
  tsv             TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', search_text)) STORED,
  embedding       VECTOR(256) NOT NULL,
  embedding_model TEXT NOT NULL,
  FOREIGN KEY (doc_id, version) REFERENCES rag_documents (doc_id, version) ON DELETE CASCADE,
  UNIQUE (doc_id, version, ordinal)
);
CREATE INDEX rag_chunks_tsv_idx       ON rag_chunks USING GIN (tsv);
CREATE INDEX rag_chunks_embedding_idx ON rag_chunks USING hnsw (embedding vector_cosine_ops);`,
    },
    {
      language: 'sql',
      caption: 'handoff_tickets: tối đa một ticket open cho mỗi hội thoại (migration 0005)',
      code: `CREATE TABLE handoff_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations (id),
  trace_id        TEXT NOT NULL,
  reason          TEXT NOT NULL CHECK (reason IN ('customer_request', 'output_blocked', 'tool_limit')),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at       TIMESTAMPTZ,
  CONSTRAINT handoff_tickets_closed_chk CHECK ((status = 'closed') = (closed_at IS NOT NULL))
);

-- khách xin nhiều lần hay request gửi lặp cũng không tạo ticket thứ hai
CREATE UNIQUE INDEX handoff_tickets_one_open_idx
  ON handoff_tickets (conversation_id) WHERE status = 'open';`,
    },
  ],
  queries: [
    {
      language: 'sql',
      caption: 'Tra một lượt hỏi đáp theo trace_id: tin nhắn (đã che) và chi phí',
      code: `SELECT role, created_at, content_masked
FROM messages WHERE trace_id = '<traceId>' ORDER BY created_at;

SELECT step, model, prompt_version, input_tokens, output_tokens,
       cache_read_tokens, cache_write_tokens, cost_usd, latency_ms
FROM llm_calls WHERE trace_id = '<traceId>' ORDER BY created_at;`,
    },
    {
      language: 'sql',
      caption: 'Chi phí hôm nay (UTC): căn cứ của trần ngân sách ngày',
      code: `SELECT COALESCE(SUM(cost_usd), 0) FROM llm_calls
WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';`,
    },
    {
      language: 'sql',
      caption: 'Hàng đợi ticket đang mở, cũ nhất trước',
      code: `SELECT id, conversation_id, reason, created_at
FROM handoff_tickets WHERE status = 'open' ORDER BY created_at;`,
    },
    {
      language: 'sql',
      caption: 'Phiên bản tài liệu đang có hiệu lực hôm nay',
      code: `SELECT doc_id, version, title FROM rag_documents
WHERE effective_from <= current_date
  AND (effective_to IS NULL OR effective_to > current_date)
ORDER BY doc_id;`,
    },
  ],
  limitations: [
    'Chưa có job dọn dữ liệu cũ: messages, conversations, llm_calls chưa bị xoá theo thời gian (chính sách lưu giữ cho dữ liệu thật còn chờ quyết định)',
    'Embedding hiện là bản giả hash-v1 dựa trên băm từ: bắt được từ trùng nhưng không hiểu nghĩa; cần thay bằng model embedding thật trước khi dùng cho chất lượng tìm kiếm thật',
    'rag_documents.product và region mới chỉ là metadata, chưa tham gia lọc khi tìm kiếm',
    'trace_id và các customer_id ở conversations, handoff_tickets không có khoá ngoại (chủ ý), nên chỉ code ghi dữ liệu mới giữ cho các bảng khớp nhau',
  ],
};
