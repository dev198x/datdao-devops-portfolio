// Content for the /others page ("Builder"). Written in Vietnamese on purpose.
// Evidence entries point at PROJECTS by slug, so titles and live links stay in one place (portfolio.ts).

export const BUILDER_INTRO = {
  headline: 'Builder: từ ý tưởng đến sản phẩm chạy thật',
  paragraphs: [
    'Mình là một builder. Mình nhận một ý tưởng còn mơ hồ, biến nó thành hệ thống chạy thật trên production, rồi tiếp tục vận hành và cải tiến. Từ thiết kế kiến trúc, viết backend và frontend, đóng gói và deploy, đến giám sát và xử lý sự cố, mình làm xuyên suốt cả vòng đời sản phẩm.',
    'Mình làm việc cùng AI agents mỗi ngày để rút ngắn thời gian: agent hỗ trợ viết và review code, kiểm tra bảo mật, phân tích log và trace, còn mình giữ vai trò quyết định kiến trúc, kiểm soát chất lượng và chịu trách nhiệm cho kết quả cuối cùng.',
    'Mình cũng có kỹ năng về cyber security: bảo mật được đưa vào ngay từ khâu thiết kế và vận hành, không để đến cuối mới vá.',
  ],
};

export interface BuilderStrength {
  title: string;
  body: string;
}

export const BUILDER_STRENGTHS: BuilderStrength[] = [
  {
    title: 'Từ ý tưởng đến production',
    body: 'Làm rõ bài toán, chọn công nghệ vừa đủ, dựng MVP nhanh rồi nâng lên mức chạy ổn định: CI/CD, giám sát, sao lưu và bảo mật cơ bản ngay từ đầu.',
  },
  {
    title: 'Làm việc cùng AI agents',
    body: 'Dùng Claude Code, subagents và MCP trong quy trình hằng ngày để tăng tốc phát triển, review code, kiểm tra bảo mật và phân tích sự cố, nhưng luôn có người xem xét kết quả trước khi dùng.',
  },
  {
    title: 'Giải pháp số cho doanh nghiệp vừa và nhỏ',
    body: 'Xây website, ứng dụng web và mobile phù hợp quy mô và ngân sách của doanh nghiệp, ưu tiên thứ chạy được và mang lại kết quả sớm thay vì hệ thống quá phức tạp.',
  },
  {
    title: 'Cyber security',
    body: 'Bảo mật từ thiết kế: xác thực và phân quyền tối thiểu, kiểm tra dữ liệu đầu vào, truy vấn tham số hoá, che dữ liệu nhạy cảm trong log, quản lý bí mật (không lưu khoá trong mã), quét lỗ hổng và rà soát bảo mật bằng AI agents trước khi triển khai.',
  },
  {
    title: 'Monitoring production với Grafana LGTM stack',
    body: 'Giám sát hệ thống đang chạy bằng Grafana LGTM stack (Loki cho log, Grafana cho dashboard, Tempo cho trace, Mimir/Prometheus cho metric) cùng OpenTelemetry: nhìn thấy sự cố sớm, lần theo request qua các service và đặt cảnh báo trước khi người dùng phát hiện.',
  },
  {
    title: 'Vận hành hệ thống nội bộ, AI agents làm trung tâm',
    body: 'Thiết kế hệ thống nội bộ (quản lý, báo cáo, chăm sóc khách hàng, giám sát) trong đó AI agents xử lý việc lặp lại, còn con người tập trung vào quyết định.',
  },
];

export interface BuilderStep {
  step: string;
  title: string;
  body: string;
}

export const BUILDER_PROCESS: BuilderStep[] = [
  { step: '01', title: 'Hiểu bài toán', body: 'Làm rõ mục tiêu kinh doanh, người dùng và giới hạn (thời gian, ngân sách, dữ liệu).' },
  { step: '02', title: 'Thiết kế và dựng MVP', body: 'Chốt kiến trúc gọn, dựng bản chạy được sớm để kiểm chứng ý tưởng.' },
  { step: '03', title: 'Build cùng AI agents', body: 'Phát triển nhanh với agent hỗ trợ, có review, kiểm thử và rà soát bảo mật trước khi hợp nhất.' },
  { step: '04', title: 'Deploy và vận hành', body: 'Đóng gói bằng Docker, tự động hoá bằng CI/CD, theo dõi bằng log, metric, trace (Grafana LGTM) và cảnh báo.' },
  { step: '05', title: 'Cải tiến liên tục', body: 'Đọc số liệu thực tế, sửa lỗi và bổ sung tính năng theo nhu cầu người dùng.' },
];

export interface BuilderService {
  title: string;
  body: string;
}

export const BUILDER_SERVICES: BuilderService[] = [
  { title: 'Website và landing page', body: 'Trang giới thiệu, trang bán hàng, blog; tối ưu tốc độ và SEO.' },
  { title: 'Ứng dụng web và app', body: 'Hệ thống đặt lịch, quản lý khách hàng, cổng thông tin, ứng dụng nghiệp vụ riêng.' },
  { title: 'Hệ thống nội bộ', body: 'Công cụ quản lý, báo cáo và tự động hoá quy trình, tích hợp AI agents vào công việc hằng ngày.' },
  { title: 'Hạ tầng, vận hành và bảo mật', body: 'Triển khai trên AWS, CI/CD, giám sát bằng Grafana LGTM stack, xử lý sự cố, rà soát và tăng cường bảo mật cho hệ thống đang chạy.' },
];

export interface BuilderEvidence {
  /** Slug of an entry in PROJECTS (src/data/portfolio.ts). */
  slug: string;
  /** What this product proves, in one line. */
  proves: string;
  /** Honest status label of where it runs. */
  status: string;
}

export const BUILDER_EVIDENCE: BuilderEvidence[] = [
  {
    slug: 'ai-observability-platform',
    proves: 'AI agent làm trung tâm trong vận hành: tự quét lỗi, đối chiếu trace và đề xuất nguyên nhân gốc, giảm thời gian điều tra sự cố 50–75%.',
    status: 'Đang dùng trong môi trường thực tế',
  },
  {
    slug: 'shaire-salon',
    proves: 'Từ ý tưởng đến sản phẩm chạy thật cho doanh nghiệp dịch vụ: ra mắt MVP nhanh trên Parse Platform và React, chạy production trên AWS.',
    status: 'Production trên AWS EC2',
  },
  {
    slug: 'booking-online-eks',
    proves: 'Bài toán khó của hệ thống đặt chỗ: không đặt trùng, không bán quá số lượng, thanh toán idempotent; đóng gói và deploy bằng Helm và GitHub Actions.',
    status: 'Môi trường development trên AWS EKS',
  },
  {
    slug: 'customer-support-chatbot-rag',
    proves: 'Chatbot chăm sóc khách hàng dùng RAG và tool calling, quan sát toàn bộ luồng bằng OpenTelemetry.',
    status: 'Bản demo trực tuyến',
  },
  {
    slug: 'portfolio-website',
    proves: 'Chính trang web này: tự thiết kế, build, deploy tự động bằng CI/CD lên tên miền riêng, có SEO và prerender.',
    status: 'Production, deploy tự động',
  },
];

export interface BuilderFigure {
  /** File name under public/images. */
  file: string;
  alt: string;
  caption: string;
}

export const BUILDER_MONITORING = {
  title: 'Monitoring production với Grafana LGTM stack',
  intro:
    'Một hệ thống chạy thật cần được nhìn thấy: log cho biết chuyện gì xảy ra, trace cho biết xảy ra ở đâu, metric cho biết mức độ nghiêm trọng. Mình gom cả ba vào Grafana LGTM stack để lần từ cảnh báo đến nguyên nhân gốc trong một giao diện.',
  figures: [
    {
      file: 'grafana-lgtm-architecture.svg',
      alt: 'Sơ đồ luồng dữ liệu Grafana LGTM stack: ứng dụng, OpenTelemetry Collector, Loki, Tempo, Mimir, Grafana và cảnh báo',
      caption: 'Luồng dữ liệu: ứng dụng gửi log, trace, metric qua OpenTelemetry Collector (gom lô, xoá dữ liệu nhạy cảm) vào Loki, Tempo, Mimir; Grafana hiển thị và gửi cảnh báo.',
    },
    {
      file: 'grafana-lgtm-dashboard.svg',
      alt: 'Minh hoạ dashboard Grafana với metric, trace, log và cảnh báo (dữ liệu mẫu)',
      caption: 'Minh hoạ dashboard (dữ liệu mẫu, không phải số liệu thật): từ cảnh báo, xem metric tăng đột biến, mở trace tìm span chậm, rồi đọc log liên quan.',
    },
  ] as BuilderFigure[],
};
