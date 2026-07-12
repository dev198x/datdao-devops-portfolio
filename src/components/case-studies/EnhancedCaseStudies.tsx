import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Target, 
  Users, 
  Code, 
  Database, 
  Cloud,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Settings,
  GitBranch,
  Container,
  Globe,
  Server,
  Lock,
  Cpu,
  Network,
  Monitor
} from 'lucide-react';
import { 
  AnimatedBackground, 
  TechBadge, 
  StatsCard, 
  ProgressBar, 
  TimelineItem, 
  InteractiveButton,
  categoryColors,
  statusColors,
  difficultyColors
} from '../visual/VisualComponents';

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  category: keyof typeof categoryColors;
  featured: boolean;
  timeline: {
    start: string;
    end: string;
    duration: string;
  };
  challenge: string;
  solution: string[];
  impact: string[];
  technologies: string[];
  impactMetrics: {
    deploymentTime?: { before: string; after: string; improvement: string };
    cost?: { before: string; after: string; reduction: string };
    performance?: { improvement: string };
    availability?: { uptime: string; improvement: string };
    scalability?: { capacity: string; improvement: string };
  };
  architecture?: {
    components: string[];
    pattern: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Amazon Clone — EKS & ArgoCD Deployment",
    subtitle: "E-commerce Platform with GitOps",
    category: "DevOps",
    featured: true,
    timeline: {
      start: "Sep 2024",
      end: "Nov 2024",
      duration: "2 months"
    },
    challenge: "Migrate a complex e-commerce platform to a scalable Kubernetes infrastructure while implementing GitOps practices for automated deployments and ensuring zero-downtime updates.",
    solution: [
      "Designed and implemented production-grade EKS cluster with multi-AZ deployment",
      "Set up ArgoCD for GitOps-based continuous deployment with progressive delivery",
      "Implemented automated CI/CD pipelines with GitHub Actions and Docker",
      "Configured monitoring and alerting with Prometheus and Grafana",
      "Established security practices with RBAC, network policies, and image scanning"
    ],
    impact: [
      "Reduced deployment time from 45 minutes to 5 minutes",
      "Achieved 99.9% uptime with automated failover",
      "Decreased infrastructure costs by 30% through autoscaling",
      "Improved developer productivity with self-service deployments",
      "Enhanced security posture with automated compliance checks"
    ],
    technologies: ["AWS EKS", "ArgoCD", "GitOps", "Kubernetes", "Docker", "Terraform", "GitHub Actions"],
    impactMetrics: {
      deploymentTime: { before: "45 min", after: "8 min", improvement: "82%" },
      cost: { before: "$2,400/mo", after: "$1,800/mo", reduction: "25%" },
      availability: { uptime: "99.5%", improvement: "1.5%" },
      scalability: { capacity: "5x", improvement: "500%" }
    },
    architecture: {
      components: ["EKS Cluster", "ArgoCD", "Application Pods", "Load Balancers", "Database", "Cache Layer"],
      pattern: "Microservices with GitOps"
    }
  },
  {
    id: 2,
    title: "Realtime Chat Application",
    subtitle: "WebSocket Architecture with Scaling",
    category: "Full-Stack",
    featured: false,
    timeline: {
      start: "Oct 2024",
      end: "Dec 2024",
      duration: "3 months"
    },
    challenge: "Build a real-time chat application capable of handling thousands of concurrent users with message persistence, typing indicators, and file sharing capabilities.",
    solution: [
      "Implemented WebSocket-based real-time communication architecture",
      "Designed horizontal scaling strategy with Redis Pub/Sub for session sharing",
      "Created message queue system for handling high message volumes",
      "Built responsive React frontend with real-time UI updates",
      "Implemented end-to-end encryption for secure communications"
    ],
    impact: [
      "Supports 10,000+ concurrent users seamlessly",
      "Achieved <100ms message delivery latency",
      "Reduced server costs by 40% through efficient resource usage",
      "Improved user engagement by 65% with instant messaging",
      "Maintained 99.8% uptime with automatic scaling"
    ],
    technologies: ["Node.js", "WebSocket", "Redis", "MongoDB", "React", "Socket.io", "AWS"],
    impactMetrics: {
      performance: { improvement: "80%" },
      scalability: { capacity: "500+ users", improvement: "300%" },
      availability: { uptime: "99.2%", improvement: "1.2%" }
    },
    architecture: {
      components: ["WebSocket Server", "Redis Cluster", "MongoDB", "React Client", "CDN", "Load Balancer"],
      pattern: "Real-time with Horizontal Scaling"
    }
  },
  {
    id: 3,
    title: "Cloud Infrastructure Automation",
    subtitle: "Multi-Cloud DevOps Pipeline",
    category: "Cloud Infrastructure",
    featured: true,
    timeline: {
      start: "Aug 2024",
      end: "Oct 2024",
      duration: "3 months"
    },
    challenge: "Design and implement a comprehensive cloud infrastructure automation solution that supports multi-cloud deployments with consistent security, monitoring, and governance across AWS, Azure, and GCP.",
    solution: [
      "Created unified Infrastructure as Code templates using Terraform",
      "Implemented automated security scanning and compliance checking",
      "Built centralized logging and monitoring with ELK stack",
      "Designed disaster recovery and backup automation",
      "Established governance frameworks with policy-as-code"
    ],
    impact: [
      "Reduced infrastructure provisioning time by 75%",
      "Achieved consistent security posture across all cloud providers",
      "Decreased compliance violations by 90%",
      "Improved disaster recovery time from hours to minutes",
      "Enhanced resource utilization efficiency by 45%"
    ],
    technologies: ["Terraform", "AWS", "Azure", "GCP", "Ansible", "Jenkins", "ELK Stack"],
    impactMetrics: {
      deploymentTime: { before: "4 hours", after: "45 min", improvement: "81%" },
      cost: { before: "$3,200/mo", after: "$2,400/mo", reduction: "25%" },
      performance: { improvement: "120%" }
    },
    architecture: {
      components: ["Terraform Modules", "CI/CD Pipeline", "Security Scanning", "Monitoring", "Backup System"],
      pattern: "Multi-Cloud IaC"
    }
  },
  {
    id: 4,
    title: "Indexes in PostgreSQL",
    subtitle: "A Practical Reference: Types, Examples, and When to Use Each",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "Queries slow down as tables grow because PostgreSQL falls back to a sequential scan — reading every row — when there's no index to jump straight to the matching rows. Picking the wrong index type (or none at all) wastes both query time and write performance.",
    solution: [
      "B-Tree (default) — best for =, <, >, BETWEEN, ORDER BY on sortable types. Use for primary keys, foreign keys, and any equality/range lookup.\nCREATE INDEX idx_users_email ON users(email);\nQuery: SELECT * FROM users WHERE email = 'a@b.com';",
      "Hash — faster than B-Tree for pure equality (=) checks only, no range support. Use when you only ever filter with WHERE col = value.\nCREATE INDEX idx_users_email_hash ON users USING HASH(email);\nQuery: SELECT * FROM users WHERE email = 'a@b.com';",
      "GIN (Generalized Inverted Index) — built for composite/multi-value columns. Use for jsonb, array, and full-text search (tsvector) columns.\nCREATE INDEX idx_posts_tags ON posts USING GIN(tags);\nQuery: SELECT * FROM posts WHERE tags @> ARRAY['postgres'];",
      "GiST (Generalized Search Tree) — supports 'nearest neighbor' and overlap queries. Use for geometric data (PostGIS), ranges, and full-text search.\nCREATE INDEX idx_locations_geom ON locations USING GIST(geom);\nQuery: SELECT * FROM locations ORDER BY geom <-> ST_MakePoint(-122.4, 37.8) LIMIT 5;",
      "BRIN (Block Range Index) — tiny index size, best for huge tables that are naturally sorted (e.g. append-only time-series/log data).\nCREATE INDEX idx_logs_created_at ON logs USING BRIN(created_at);\nQuery: SELECT * FROM logs WHERE created_at BETWEEN '2026-07-01' AND '2026-07-31';",
      "Partial Index — indexes only the rows you actually query often, keeping the index small and fast.\nCREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending';\nQuery: SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;",
      "Composite Index — speeds up queries filtering on both columns together; column order matters — put the most selective/equality column first.\nCREATE INDEX idx_orders_user_status ON orders(user_id, status);\nQuery: SELECT * FROM orders WHERE user_id = 42 AND status = 'shipped';",
      "Unique Index — enforces no-duplicates as a side effect of indexing; this is what PRIMARY KEY and UNIQUE constraints create under the hood.\nCREATE UNIQUE INDEX idx_users_email_unique ON users(email);\nQuery: INSERT INTO users(email) VALUES('a@b.com'); -- fails with a unique violation on duplicate",
      "Expression Index — indexes the *result* of a function/expression. Use when queries filter on a transformed value.\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\nQuery: SELECT * FROM users WHERE LOWER(email) = 'a@b.com';",
      "Covering Index (INCLUDE) — lets PostgreSQL answer the query from the index alone ('Index Only Scan') without touching the table, when the SELECT list only needs the included columns.\nCREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (status, total);\nQuery: SELECT status, total FROM orders WHERE user_id = 42;",
      "Full-Text Search — enables fast full-text matching instead of slow ILIKE '%term%' scans.\nCREATE INDEX idx_articles_search ON articles USING GIN(to_tsvector('english', body));\nQuery: SELECT * FROM articles WHERE to_tsvector('english', body) @@ to_tsquery('postgres & index');",
      "Multicolumn Sort Order — matches a query like 'latest orders per user' so PostgreSQL can skip an extra sort step.\nCREATE INDEX idx_orders_recent ON orders(user_id, created_at DESC);\nQuery: SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;"
    ],
    impact: [
      "Turns O(n) sequential scans into O(log n) lookups — the core reason indexed queries stay fast as tables grow",
      "Easy way to remember which one: 'B-Tree for order, Hash for equal, GIN/GiST for many-values-per-row, BRIN for huge+sorted, Partial for narrow hot paths'",
      "Every index speeds up SELECTs but slows down INSERT/UPDATE/DELETE (the index has to be maintained too) — don't index columns you never filter/sort by",
      "Use EXPLAIN ANALYZE to confirm PostgreSQL is actually using the index (look for 'Index Scan' instead of 'Seq Scan') before trusting it in production",
      "Rule of thumb: index foreign keys, columns in WHERE/JOIN/ORDER BY, and skip low-cardinality columns (like a boolean) unless paired in a composite or partial index",
      "Use case — login lookup: WHERE email = $1 on a users table with 1M+ rows → a B-Tree (or unique) index on email turns a full table scan into a near-instant lookup",
      "Use case — admin dashboard filter: WHERE status = 'pending' AND created_at > now() - interval '7 days' on a large orders table → a partial index on the 'pending' subset keeps the hot-path query fast without indexing the whole table",
      "Use case — tag/category search: WHERE tags @> ARRAY['urgent'] or a jsonb column like WHERE metadata @> '{\"plan\": \"pro\"}' → GIN is the only index type that efficiently supports these containment queries",
      "Use case — article/blog search box: user types 'postgres index' → full-text search (tsvector + GIN) ranks and matches partial words far faster and smarter than LIKE '%postgres index%'",
      "Use case — analytics/audit log table: append-only, billions of rows, queried by date range → BRIN index costs a fraction of a B-Tree's storage since it only stores per-block min/max ranges",
      "Use case — read-heavy report query: SELECT user_id, status, total FROM orders WHERE user_id = $1 → a covering index (INCLUDE status, total) answers entirely from the index, skipping a trip to the table"
    ],
    technologies: ["PostgreSQL", "B-Tree", "GIN", "GiST", "BRIN", "Hash Index", "Covering Index", "Full-Text Search", "EXPLAIN ANALYZE"],
    impactMetrics: {
      performance: { improvement: "Seq scan -> Index scan: O(n) -> O(log n)" }
    },
    architecture: {
      components: ["B-Tree", "Hash", "GIN", "GiST", "BRIN", "Partial Index", "Composite Index", "Unique Index", "Expression Index", "Covering Index"],
      pattern: "Index Type Selection Cheat Sheet"
    }
  },
  {
    id: 5,
    title: "Indexes in MongoDB",
    subtitle: "A Practical Reference: Types, Examples, and When to Use Each",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "Queries slow down as collections grow because MongoDB falls back to a collection scan (COLLSCAN) — reading every document — when there's no index to jump straight to the matching documents. Picking the wrong index type (or none at all) wastes both query time and write performance.",
    solution: [
      "Single Field — best for equality/range queries and sorts on one field. Use for _id lookups, foreign-key-style references, and any single WHERE-equivalent filter.\ndb.users.createIndex({ email: 1 });\nQuery: db.users.find({ email: 'a@b.com' });",
      "Compound — speeds up queries filtering/sorting on multiple fields together; field order matters — put equality fields before range/sort fields (ESR rule: Equality, Sort, Range).\ndb.orders.createIndex({ userId: 1, status: 1 });\nQuery: db.orders.find({ userId: 42, status: 'shipped' });",
      "Multikey — automatically created when you index a field that holds an array; indexes each array element individually. Use for tags, categories, or any array-valued field.\ndb.posts.createIndex({ tags: 1 });\nQuery: db.posts.find({ tags: 'postgres' });",
      "Text — enables fast full-text search across string fields instead of slow regex scans. Only one text index allowed per collection (can span multiple fields).\ndb.articles.createIndex({ body: 'text' });\nQuery: db.articles.find({ $text: { $search: 'mongodb index' } });",
      "Hashed — hashes the field value before indexing; used for equality lookups and as the shard key for even data distribution across a sharded cluster.\ndb.users.createIndex({ userId: 'hashed' });\nQuery: db.users.find({ userId: 42 });",
      "Wildcard — indexes all fields (or a pattern of fields) in documents with unpredictable/dynamic schemas, so you don't have to declare every field up front.\ndb.events.createIndex({ 'metadata.$**': 1 });\nQuery: db.events.find({ 'metadata.plan': 'pro' });",
      "TTL (Time-To-Live) — automatically deletes documents after a set number of seconds; ideal for sessions, logs, and temporary tokens that should expire.\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });\nQuery: db.sessions.find({ createdAt: { $gt: new Date(Date.now() - 3600000) } });",
      "Partial — indexes only documents matching a filter expression, keeping the index small and fast for a narrow hot-path query.\ndb.orders.createIndex({ createdAt: 1 }, { partialFilterExpression: { status: 'pending' } });\nQuery: db.orders.find({ status: 'pending' }).sort({ createdAt: 1 });",
      "Unique — enforces no-duplicate values for a field as a side effect of indexing; this is what backs unique constraints like one-account-per-email.\ndb.users.createIndex({ email: 1 }, { unique: true });\nQuery: db.users.insertOne({ email: 'a@b.com' }); // fails with E11000 duplicate key error on repeat",
      "Geospatial (2dsphere) — supports location-based queries like 'find nearby' and polygon containment on GeoJSON data.\ndb.locations.createIndex({ geo: '2dsphere' });\nQuery: db.locations.find({ geo: { $near: { $geometry: { type: 'Point', coordinates: [-122.4, 37.8] } } } });",
      "Covering Index (projection) — when a query's filter and returned fields are all in the index, MongoDB can answer entirely from the index without fetching documents.\ndb.orders.createIndex({ userId: 1, status: 1, total: 1 });\nQuery: db.orders.find({ userId: 42 }, { status: 1, total: 1, _id: 0 });"
    ],
    impact: [
      "Turns O(n) collection scans into O(log n) lookups — the core reason indexed queries stay fast as collections grow",
      "Easy way to remember which one: 'Single for one field, Compound for many, Multikey for arrays, Text for search, TTL for auto-expiry, Partial for narrow hot paths'",
      "Every index speeds up reads but slows down inserts/updates/deletes (the index has to be maintained too) — don't index fields you never query/sort by",
      "Use .explain('executionStats') to confirm MongoDB is actually using the index (look for IXSCAN instead of COLLSCAN) before trusting it in production",
      "Rule of thumb: index fields used in filters, sorts, and joins ($lookup), and follow the ESR rule (Equality, Sort, Range) when ordering compound index fields",
      "Use case — login lookup: db.users.find({ email }) on a users collection with 1M+ documents → a single-field (or unique) index on email turns a full collection scan into a near-instant lookup",
      "Use case — admin dashboard filter: db.orders.find({ status: 'pending', createdAt: { $gt: ... } }) on a large orders collection → a partial index on the 'pending' subset keeps the hot-path query fast without indexing every document",
      "Use case — tag/category search: db.posts.find({ tags: 'urgent' }) → a multikey index automatically supports fast lookups on any value inside the tags array",
      "Use case — article/blog search box: user types 'mongodb index' → a text index ranks and matches partial words far faster and smarter than a regex scan",
      "Use case — session/token expiry: temporary login sessions or password-reset tokens → a TTL index auto-deletes expired documents with zero cleanup cron jobs",
      "Use case — read-heavy report query: db.orders.find({ userId }, { status: 1, total: 1 }) → a covering index answers entirely from the index, skipping a trip to the documents"
    ],
    technologies: ["MongoDB", "Single Field Index", "Compound Index", "Multikey Index", "Text Index", "TTL Index", "explain()"],
    impactMetrics: {
      performance: { improvement: "COLLSCAN -> IXSCAN: O(n) -> O(log n)" }
    },
    architecture: {
      components: ["Single Field", "Compound", "Multikey", "Text", "Hashed", "Wildcard", "TTL", "Partial", "Unique", "Geospatial", "Covering Index"],
      pattern: "Index Type Selection Cheat Sheet"
    }
  },
  {
    id: 6,
    title: "How to Store Users and Daily Prices, Queryable by Price and Day",
    subtitle: "MongoDB Schema Design: Embedded Array vs. Separate Collection",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "Each user has ~30 daily price entries per month (one per day), and the app needs to query users by a price range within a date range — e.g. 'find users whose price was between 100 and 200 sometime in May 2026'. The schema choice determines whether that query stays fast as data grows.",
    solution: [
      "Option A — Embedded array of daily prices (recommended for < 100k users): keep each user's month of prices inside the user document itself. Simple to read a whole user's history in one query, and fine for ~30 entries/month.\ndb.users.createIndex({ \"prices.date\": 1, \"prices.price\": 1 });\nQuery: db.users.find({ prices: { $elemMatch: { date: { $gte: ISODate('2026-05-01'), $lte: ISODate('2026-05-31') }, price: { $gte: 100, $lte: 200 } } } });",
      "Option B — Separate `user_prices` collection (best for > 100k users or multi-year history): one document per user per day, referencing the user by ID. Scales far better because MongoDB indexes work most efficiently on flat, individually-sized documents rather than large embedded arrays.\ndb.user_prices.createIndex({ userId: 1, date: 1 });\ndb.user_prices.createIndex({ date: 1, price: 1 });\nQuery: db.user_prices.find({ userId: ObjectId('u1'), date: { $gte: ISODate('2026-05-01'), $lte: ISODate('2026-05-31') } });",
      "Compound index for 'latest price per user' access patterns — sort descending by date so the most recent entries come first without an extra in-memory sort.\ndb.user_prices.createIndex({ userId: 1, date: -1 });\nQuery: db.user_prices.find({ userId: ObjectId('u1') }).sort({ date: -1 }).limit(1);",
      "$elemMatch is required for Option A whenever you filter on two conditions (date AND price) inside the same array element — without it, MongoDB would match documents where *any* array element satisfies the date condition and *any* (possibly different) element satisfies the price condition."
    ],
    impact: [
      "Decision rule: use the embedded array (Option A) below ~100k users; switch to a separate collection (Option B) once you cross ~100k users or need multiple years of price history",
      "Option A pros: supports date/price filtering, supports analytics, easy to extend, and reads a user's full month in a single document fetch",
      "Option A con: the prices array keeps growing over time — fine at 30 entries/month, but not a pattern to reuse for unbounded-length arrays",
      "Option B pros: best indexing performance, best aggregation performance, straightforward sharding, and comfortably handles millions of users",
      "Option B con: requires a $lookup (join) back to the users collection whenever you need user details alongside price data",
      "Use case — dashboard price-range filter: 'show users priced 100-200 in May' → the compound index on (date, price) in Option B lets MongoDB use IXSCAN directly instead of scanning every user's array",
      "Use case — per-user price history page: 'show all of user u1's May prices' → the (userId, date) compound index in Option B answers this in a single indexed lookup",
      "Use case — 'current price' widget: 'what's this user's latest price' → the (userId, date: -1) index avoids an in-memory sort on every request"
    ],
    technologies: ["MongoDB", "Embedded Array", "$elemMatch", "Compound Index", "Schema Design", "Sharding"],
    impactMetrics: {
      scalability: { capacity: "100k+ users / multi-year history", improvement: "Embedded array -> Separate collection" }
    },
    architecture: {
      components: ["users (embedded prices[])", "users + user_prices (referenced)", "Compound Index (userId, date)", "Compound Index (date, price)"],
      pattern: "Embedded vs. Referenced Schema Decision"
    }
  },
  {
    id: 7,
    title: "Concurrency Problem In MongoDB",
    subtitle: "Handling Race Conditions on Payment Callbacks in MongoDB",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "A `booking` collection stores paymentInfo { amount, transactionId, card } with a unique index on paymentInfo.transactionId. Every update to paymentInfo generates a brand-new transactionId from a third-party service. Because of retry logic, duplicate callbacks, or network issues, multiple concurrent requests can try to update the same booking at once — and since they all read the same starting transactionId, they each attempt to write a different new one, tripping the unique index.",
    solution: [
      "Atomic Conditional Update (recommended) — filter the update on the transactionId you last saw; MongoDB updates are atomic per document, so only the request that still matches succeeds, and every other request's filter simply fails to match — no locking required.\nawait db.booking.findOneAndUpdate({ \"paymentInfo.transactionId\": oldTx }, { $set: { \"paymentInfo.transactionId\": newTx, \"paymentInfo.amount\": newAmount } });\nQuery: if (!result) console.log('Update skipped — already updated by another request');",
      "Optimistic Locking (version guard) — add a paymentVersion field and require it to match in the filter, incrementing it on every successful write. Works even if transactionId itself is being replaced or temporarily removed.\nawait db.booking.findOneAndUpdate({ _id: bookingId, paymentVersion: currentVersion }, { $set: { paymentInfo: newPaymentInfo }, $inc: { paymentVersion: 1 } });\nQuery: if (res.matchedCount === 0) throw new Error('Concurrent update detected');",
      "MongoDB Transactions (multi-document consistency) — wrap the booking update plus any related writes (logs, balances, histories) in a session so they commit or roll back together. Use when payment info changes must stay consistent across multiple collections.\nawait session.withTransaction(async () => { await db.collection('booking').updateOne({ 'paymentInfo.transactionId': oldTx }, { $set: { 'paymentInfo.transactionId': newTx } }, { session }); });\nQuery: await db.collection('paymentLogs').insertOne({ oldTx, newTx }, { session });",
      "Idempotent Callback Key (bonus pattern) — store the last processed callbackId/requestId on the document and reject duplicate callbacks outright, stopping the race before it starts. Best for callback-heavy systems like payment gateway webhooks.\ndb.booking.updateOne({ _id: id, lastCallbackId: { $ne: callbackId } }, { $set: { paymentInfo, lastCallbackId: callbackId } });\nQuery: db.booking.findOne({ _id: id, lastCallbackId: callbackId }); // confirms whether this callback was already applied"
    ],
    impact: [
      "Race condition timeline: Request A and Request B both fetch the booking while transactionId = 'tx123' → both generate a new transactionId ('tx124' vs 'tx125') and try to write it → the unique index on paymentInfo.transactionId turns whichever one loses the race into a duplicate-key error or an inconsistent state",
      "Recommended default for single-document, retry/duplicate-callback scenarios: the atomic conditional update — it's idempotent, needs no extra schema changes, and prevents duplicate-transactionId errors entirely",
      "Comparison — Conditional Update: simple, atomic, fast → best for single-document concurrency",
      "Comparison — Version Guard: explicitly detects concurrent updates → best when multiple app layers/services can write concurrently",
      "Comparison — Transaction: atomic across collections → best for complex, multi-step payment workflows",
      "Comparison — Idempotent Key: ignores duplicate callbacks before they can race → best for callback-heavy systems like payment webhooks",
      "Sources of concurrency to defend against: race conditions between simultaneous user actions, client/queue retry logic, duplicate third-party callbacks, and transient network issues causing repeated requests"
    ],
    technologies: ["MongoDB", "findOneAndUpdate", "Optimistic Locking", "Transactions", "Idempotency", "Unique Index"],
    impactMetrics: {
      performance: { improvement: "Race condition -> idempotent single-writer guarantee" }
    },
    architecture: {
      components: ["Atomic Conditional Update", "Optimistic Locking (version guard)", "MongoDB Transaction", "Idempotent Callback Key"],
      pattern: "Concurrency-Safe Update Patterns"
    }
  },
  {
    id: 8,
    title: "Concurrent Problem In Relationship DB",
    subtitle: "Handling Race Conditions on Payment Callbacks in PostgreSQL/MySQL",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "The same payment-callback race condition seen in MongoDB applies to a relational schema too: a bookings table has a UNIQUE transaction_id, and a 1-to-many relationship to a payments table (one booking -> many payment attempts). Multiple concurrent callbacks for the same booking each generate a new transaction_id and try to write it, risking a unique constraint violation, a lost update (second write silently overwrites the first), or an inconsistent foreign-key state if a related insert fails halfway.",
    solution: [
      "Optimistic Concurrency (version / updated_at check) — identical in spirit to the Mongo conditional update: filter the UPDATE on the transaction_id you last read. If the WHERE clause matches nothing, ROW_COUNT = 0 tells your app it lost the race. Atomic, fast, and lightweight.\nUPDATE bookings SET amount = $2, card = $3, transaction_id = $4, updated_at = NOW() WHERE id = $1 AND transaction_id = $5;\nQuery: -- if affected rows = 0, another process already updated this booking",
      "Pessimistic Lock (SELECT ... FOR UPDATE) — guarantees only one transaction updates a given booking at a time by locking the row until COMMIT. Very safe for payment contexts, but can cause blocking if many retries arrive simultaneously.\nBEGIN; SELECT * FROM bookings WHERE id = $1 FOR UPDATE;\nQuery: UPDATE bookings SET amount = $2, card = $3, transaction_id = $4 WHERE id = $1; COMMIT;",
      "Isolated Payment Attempts (relational design) — instead of overwriting transaction_id on bookings, insert each new transaction as its own row in payments and let bookings just reference the latest one. Naturally supports retries, full payment-history auditing, and removes the race from bookings entirely.\nINSERT INTO payments (booking_id, transaction_id, amount, card, status) VALUES ($1, $2, $3, $4, 'PENDING') ON CONFLICT (transaction_id) DO NOTHING;\nQuery: UPDATE bookings SET current_payment_id = (SELECT id FROM payments WHERE transaction_id = $2) WHERE id = $1;",
      "Serializable Isolation Level — for maximum consistency, run the transaction so concurrent updates to the same booking act as if executed sequentially, even though they ran concurrently. PostgreSQL automatically detects the conflict and rolls back the losing transaction.\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nQuery: -- PostgreSQL raises a serialization_failure on the losing transaction; the app should catch it and retry"
    ],
    impact: [
      "Same root problem as MongoDB: two payment callbacks for the same booking each generate a new transaction_id and try to write it — the UNIQUE constraint on transaction_id turns the loser into a constraint violation, a lost update, or an inconsistent foreign-key state if a related insert fails halfway",
      "Recommended production design: always INSERT a new payments row per callback (ON CONFLICT DO NOTHING makes retries a free no-op), then update bookings.current_payment_id to point at the latest payment, wrapped in a transaction with SELECT ... FOR UPDATE",
      "SQL vs. MongoDB — unique constraint (SQL) is the same concept as a unique index (Mongo); UPDATE ... WHERE transaction_id = oldTx mirrors findOneAndUpdate({ oldTx }); WHERE version = oldVersion mirrors the manual version-field guard",
      "SQL vs. MongoDB — pessimistic row locking (SELECT ... FOR UPDATE) has no per-row equivalent in MongoDB; multi-table transactions are native and mature in SQL vs. only available since MongoDB 4.0",
      "Use case — payment gateway webhook retries: ON CONFLICT (transaction_id) DO NOTHING on the payments table makes duplicate callbacks a harmless no-op instead of a thrown error",
      "Use case — high-value transaction requiring strict consistency: SERIALIZABLE isolation lets PostgreSQL auto-detect the race and reject the losing concurrent transaction instead of silently corrupting state",
      "Use case — full audit trail requirement: modeling payments as its own table (rather than overwriting a single column) keeps every retry/attempt on record for compliance and debugging"
    ],
    technologies: ["PostgreSQL", "MySQL", "SELECT FOR UPDATE", "SERIALIZABLE", "ON CONFLICT", "Foreign Key", "Optimistic Locking"],
    impactMetrics: {
      performance: { improvement: "Lost update / unique violation -> serializable, auditable payment history" }
    },
    architecture: {
      components: ["Optimistic Concurrency (WHERE match)", "Pessimistic Lock (FOR UPDATE)", "Isolated Payment Attempts (payments table)", "Serializable Isolation"],
      pattern: "SQL Concurrency Control Strategies"
    }
  },
  {
    id: 9,
    title: "BullMQ — A Redis-Based Queue Library for Microservices",
    subtitle: "Common Features: Retries, Delays, Cron Jobs, Flows, and Rate Limiting",
    category: "DevOps",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "Microservices need to hand off background work — sending emails, charging payments, generating reports — without calling each other synchronously over HTTP, which couples services together and loses the job entirely if a request fails mid-flight or a service is down. There needs to be a shared, durable, and observable way to queue work between independently deployed and scaled services.",
    solution: [
      "Producer/Consumer via Queue + Worker — the core primitive. One service enqueues jobs; a separate service (running as its own process/pod) consumes and processes them. The only shared dependency is Redis, not a direct network call between services.\nconst queue = new Queue('emails', { connection });\nQuery: await queue.add('sendWelcome', { userId, email }, { attempts: 3 });",
      "Retries with Backoff — automatic retry on failure with configurable backoff (fixed or exponential), so a transient error (network blip, downstream service briefly down) doesn't lose the job.\nawait queue.add('chargeCard', data, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });\nQuery: // retries at 1s, 2s, 4s, 8s, 16s before moving to the 'failed' state",
      "Delayed Jobs — schedule a job to become available at a future time instead of immediately, e.g. reminder emails, timeout checks, or abandoned-cart follow-ups.\nawait queue.add('sendReminder', data, { delay: 24 * 60 * 60 * 1000 });\nQuery: // job only becomes available to workers after 24 hours",
      "Repeatable Jobs (cron) — run recurring jobs (nightly reports, cleanup tasks, cache warms) on a cron pattern without standing up a separate cron service.\nawait queue.add('dailyReport', {}, { repeat: { pattern: '0 0 * * *' } });\nQuery: // runs automatically every day at midnight",
      "Concurrency & Rate Limiting per Worker — control how many jobs a single worker processes in parallel, and cap total throughput against rate-limited downstream APIs (payment gateways, email providers).\nconst worker = new Worker('emails', processor, { connection, concurrency: 10, limiter: { max: 100, duration: 1000 } });\nQuery: // up to 10 jobs processed concurrently, capped at 100 jobs/second overall",
      "Priority Queues — assign job priority so urgent work jumps ahead of bulk/background jobs already waiting in the same queue.\nawait queue.add('passwordReset', data, { priority: 1 });\nQuery: // lower number = higher priority; processed before default-priority jobs",
      "Flows (Parent-Child Job Dependencies) — chain jobs across queues/services so a parent job only completes once all its children finish, even when each child is processed by a different microservice.\nconst flow = new FlowProducer({ connection });\nQuery: await flow.add({ name: 'processOrder', queueName: 'orders', children: [{ name: 'chargePayment', queueName: 'payments' }, { name: 'reserveStock', queueName: 'inventory' }] });",
      "Deduplication via Job ID — prevent duplicate processing of the same logical event (e.g. a duplicate webhook callback) by giving the job a deterministic ID.\nawait queue.add('processWebhook', data, { jobId: webhookEventId });\nQuery: // adding a job with an existing jobId is a safe no-op against duplicate callbacks",
      "Events & Observability (QueueEvents) — subscribe to completed/failed/progress events from any service, useful for logging, metrics dashboards, or triggering a downstream action in another microservice.\nconst queueEvents = new QueueEvents('emails', { connection });\nQuery: queueEvents.on('completed', ({ jobId }) => console.log(`Job ${jobId} completed`));"
    ],
    impact: [
      "Redis as the only shared dependency — producer and consumer services never call each other directly; they only need access to the same Redis instance, giving true loose coupling between microservices",
      "Jobs survive crashes and restarts — jobs live in Redis, not in-process memory, so a worker pod dying mid-job doesn't lose it; BullMQ's stalled-job recovery makes it available to another worker",
      "Independent scaling per queue — the emails, payments, and inventory queues can each be scaled by adding more workers to just that queue, without scaling the rest of the system",
      "Backoff + max attempts stops cascading failures — after N attempts a job moves to 'failed' instead of retrying forever and hammering an already-struggling downstream dependency",
      "Flows let one service orchestrate work across several others without synchronous request/response calls — the parent job only resolves once every child job, regardless of which microservice processed it, completes",
      "Rate limiting protects downstream third-party APIs from being overwhelmed when a burst of jobs is enqueued all at once",
      "Deduplication via a deterministic jobId is the same idempotency pattern used in the payment-callback concurrency case studies above — safe against retries and duplicate webhook deliveries",
      "Use case — order processing: an orchestrator service enqueues 'chargePayment' and 'reserveStock' as child jobs via FlowProducer; payments-service and inventory-service each own their own queue/worker, and the orchestrator proceeds only once both report success",
      "Use case — notifications service: delayed jobs send a 24-hour reminder email, and a repeatable cron job sends a nightly digest — no separate cron infrastructure required"
    ],
    technologies: ["BullMQ", "Redis", "Node.js", "Queue", "Worker", "FlowProducer", "Rate Limiting"],
    impactMetrics: {
      performance: { improvement: "Tightly-coupled sync calls -> decoupled, retry-safe async job queue" }
    },
    architecture: {
      components: ["Queue (Producer)", "Worker (Consumer)", "FlowProducer (Job Dependencies)", "QueueEvents (Observability)", "Redis (Shared State)"],
      pattern: "Redis-Backed Job Queue for Microservices"
    }
  },
  {
    id: 10,
    title: "Strong vs. Eventual Consistency",
    subtitle: "What They Are, and the Trade-off Between Them in Distributed Systems",
    category: "Database",
    featured: false,
    timeline: {
      start: "Reference",
      end: "Reference",
      duration: "Quick read"
    },
    challenge: "Distributed systems replicate data across multiple nodes and regions for availability and low latency. But a system can't always guarantee that every read instantly reflects the very latest write *and* stay fast and available everywhere at the same time — especially during a network partition. Teams have to explicitly choose, per use case, how 'fresh' a read is allowed to be.",
    solution: [
      "Eventual Consistency in Practice — instead of guaranteeing immediate consistency (strong consistency), the system prioritizes availability and partition tolerance, which aligns with the CAP theorem. Imagine an e-commerce system with these microservices:\n```text\n          Customer\n              |\n        Order Service\n              |\n      +-------+-------+\n      |               |\nPayment Service   Inventory Service\n      |\n Notification Service\n```\nHow to read this diagram:\n- Customer places an order through the Order Service — this is the single entry point and source of truth for 'an order was placed'.\n- The Order Service then fans out to two independent services in parallel: Payment Service (charges the card) and Inventory Service (reserves the stock). Neither waits synchronously for the other — each processes the order asynchronously, on its own timeline, often via an event/message queue rather than a direct blocking call.\n- Payment Service, once it confirms the charge succeeded, triggers the Notification Service (e.g. 'send order confirmation email') — another asynchronous hop downstream.\n- At the moment the Customer's order is placed, Inventory may not have reserved stock yet, and the Notification may not have gone out yet — every service is temporarily 'behind' the Order Service's view of the world. This is eventual consistency: each service's data converges to the correct final state (paid, stock reserved, notified) a little while after the order event, not instantly.\n- Why this is the right trade-off here: if Payment Service or Inventory Service is briefly slow or down, the Order Service can still accept the order (Availability) instead of blocking the customer's checkout waiting for every downstream service to confirm in lockstep (Strong Consistency). The system tolerates that temporary gap because an order confirmation email arriving 2 seconds late is harmless, whereas rejecting checkouts every time one internal service is momentarily slow would hurt the business far more.",
      "Implementing This With BullMQ — the Order Service publishes jobs to Redis-backed queues instead of calling Payment Service and Inventory Service directly over HTTP; each downstream service runs its own Worker, polling and processing on its own schedule. This is exactly the decoupling BullMQ is built for, and it's what makes the eventual-consistency gap in the diagram above safe: the order is accepted the instant the jobs are enqueued, regardless of whether Payment/Inventory workers are fast, slow, or briefly offline.\nconst orderQueue = new Queue('order-events', { connection });\nQuery: await orderQueue.add('order.placed', { orderId, items, cardToken }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });",
      "Payment Service and Inventory Service each run an independent Worker on the same event, so a slow/failed payment never blocks stock from being reserved (or vice versa) — this is the 'fan out to two independent services in parallel' step from the diagram.\nconst paymentWorker = new Worker('order-events', chargeCardProcessor, { connection, concurrency: 20 });\nQuery: const inventoryWorker = new Worker('order-events', reserveStockProcessor, { connection, concurrency: 20 });",
      "Notification Service is chained after Payment Service succeeds, using a BullMQ Flow so the confirmation email only fires once the charge is actually confirmed — the 'Payment Service triggers Notification Service' arrow from the diagram, made durable and retry-safe.\nconst flow = new FlowProducer({ connection });\nQuery: await flow.add({ name: 'chargeCard', queueName: 'payments', data, children: [{ name: 'sendConfirmationEmail', queueName: 'notifications', data }] });",
      "Retries and backoff absorb the 'temporarily behind' window from the diagram — if Payment Service's third-party card processor times out, BullMQ retries automatically instead of losing the job, so the system still converges to the correct final state without the Order Service needing to know any of that happened.\nQuery: // job attempts at 1s, 2s, 4s, 8s, 16s before landing in 'failed' for manual/alerted follow-up"
    ],
    impact: [
      "CAP theorem framing: during a network partition, a distributed system must choose Consistency (reject or wait for the request) or Availability (serve a possibly-stale response) — it can't fully guarantee both at once. Eventual consistency picks Availability; strong consistency picks Consistency.",
      "Use case — bank account balance / payment ledger: requires strong consistency; showing a stale balance could let a user double-spend funds before a second read catches up",
      "Use case — social media like-count / view-count: eventual consistency is fine, even preferable; a few seconds of a stale count is invisible to users, while strong consistency there would slow down every single read for no real benefit",
      "Use case — global multi-region product catalog: eventual consistency lets each region serve reads locally with low latency; a product description propagating in ~1 second across regions is an acceptable trade-off for speed",
      "Use case — leader election / distributed lock (e.g. Kubernetes control plane, ZooKeeper, etcd): requires strong consistency via consensus (Raft/Paxos) — two nodes both believing they're the leader is a correctness-breaking split-brain scenario",
      "Rule of thumb: choose strong consistency when a correctness violation is costly or irreversible (money, inventory oversell, leader election); choose eventual consistency when staleness is cheap and availability/latency matter more (feeds, counters, caches, DNS, CDNs)",
      "Tunable consistency (MongoDB's readConcern levels — local, majority, linearizable — and readPreference — primary, secondary) is the practical middle ground most production systems actually use — pick the consistency level per query instead of committing the whole architecture to one extreme"
    ],
    technologies: ["CAP Theorem", "Microservices", "Event-Driven Architecture", "BullMQ", "Redis", "Eventual Consistency", "Distributed Systems"],
    impactMetrics: {
      scalability: { capacity: "Global multi-region reads", improvement: "Strong (coordinated) -> Eventual (local, low-latency)" }
    },
    architecture: {
      components: ["Single-Leader / Synchronous Replication (Strong)", "Consensus — Raft/Paxos (Strong)", "Multi-Leader / Leaderless Replication (Eventual)", "Tunable Consistency (Quorum)"],
      pattern: "Consistency Model Trade-off (CAP Theorem)"
    },
    comparisonTable: {
      headers: ["Aspect", "Strong Consistency", "Eventual Consistency"],
      rows: [
        ["Data visibility", "All clients immediately see the latest data", "Clients may temporarily see stale data"],
        ["Read after write", "Always guaranteed", "Not always guaranteed"],
        ["Synchronization", "Synchronous", "Asynchronous"],
        ["Response time", "Higher latency", "Lower latency"],
        ["Availability", "Can decrease during failures", "Usually higher"],
        ["Scalability", "More difficult", "Easier"],
        ["Typical architecture", "Monolith, single database, distributed DB with consensus", "Microservices, event-driven architecture"],
        ["Example", "Bank account balance", "Email notifications"]
      ]
    }
  }
];

const EnhancedCaseStudies: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<number | null>(caseStudies[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'solution' | 'results'>('overview');

  const selectedStudyData = caseStudies.find(study => study.id === selectedStudy);

  const categories = ['All', 'DevOps', 'Cloud Infrastructure', 'Full-Stack', 'Database'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredStudies = selectedCategory === 'All' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === selectedCategory);

  const getIconForMetric = (metric: string) => {
    switch (metric) {
      case 'deploymentTime': return <Zap className="w-5 h-5" />;
      case 'cost': return <TrendingUp className="w-5 h-5" />;
      case 'performance': return <BarChart3 className="w-5 h-5" />;
      case 'availability': return <Target className="w-5 h-5" />;
      case 'scalability': return <TrendingUp className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

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
            docker images | grep -Ei 'case|study'
          </h1>
          <p className="text-green-200 text-lg max-w-3xl mx-auto">
            Real-world projects showcasing innovative solutions, measurable impact, and technical excellence across DevOps, Cloud Infrastructure, and Full-Stack Development
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <StatsCard
            title="Projects Completed"
            value="3"
            icon={<FileText className="w-6 h-6" />}
            color="completed"
          />
          <StatsCard
            title="Cost Savings"
            value="35%"
            change="Average across projects"
            icon={<TrendingUp className="w-6 h-6" />}
            color="completed"
            trend="up"
          />
          <StatsCard
            title="Uptime Achieved"
            value="99.5%"
            change="Production reliability"
            icon={<Target className="w-6 h-6" />}
            color="completed"
            trend="up"
          />
        </motion.div>

        {/* Study Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-green-400 text-black'
                    : 'bg-gray-800 text-green-400 border border-gray-600 hover:border-green-400'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredStudies.map((study) => (
              <motion.div
                key={study.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStudy(study.id)}
                className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
                  selectedStudy === study.id
                    ? 'bg-green-400/10 border-green-400'
                    : 'bg-gray-900/50 border-gray-700 hover:border-green-400/50'
                } ${study.featured ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <TechBadge name={study.category} category={study.category} size="sm" />
                  {study.featured && (
                    <span className="text-xs text-yellow-400 font-medium">⭐ Featured</span>
                  )}
                </div>
                
                <h3 className="text-white font-bold mb-1 text-sm line-clamp-2">
                  {study.title}
                </h3>
                
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {study.subtitle}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{study.timeline.duration}</span>
                  <span>•</span>
                  <span>{study.timeline.start} - {study.timeline.end}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Study Details */}
        <AnimatePresence mode="wait">
          {selectedStudyData && (
            <motion.div
              key={selectedStudyData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Study Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <TechBadge name={selectedStudyData.category} category={selectedStudyData.category} />
                      {selectedStudyData.featured && (
                        <span className="text-xs text-yellow-400 font-medium">⭐ Featured Project</span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedStudyData.title}
                    </h2>
                    <p className="text-green-400 text-lg">
                      {selectedStudyData.subtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="text-center">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <p className="font-medium">{selectedStudyData.timeline.start}</p>
                      <p className="text-xs">Start Date</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <p className="font-medium">{selectedStudyData.timeline.duration}</p>
                      <p className="text-xs">Duration</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <p className="font-medium">{selectedStudyData.timeline.end}</p>
                      <p className="text-xs">Completion</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700">
                {[
                  { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
                  { id: 'solution', label: 'Solution', icon: <Code className="w-4 h-4" /> },
                  { id: 'results', label: 'Results', icon: <BarChart3 className="w-4 h-4" /> }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-gray-400 hover:text-green-400'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Challenge
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {selectedStudyData.challenge}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                              <Settings className="w-5 h-5" />
                              Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedStudyData.technologies.map((tech) => (
                                <TechBadge key={tech} name={tech} category={selectedStudyData.category} size="sm" />
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                              <GitBranch className="w-5 h-5" />
                              Architecture Pattern
                            </h3>
                            <p className="text-gray-300 mb-2 font-medium">
                              {selectedStudyData.architecture?.pattern}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedStudyData.architecture?.components.map((component) => (
                                <span key={component} className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded">
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'solution' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Solution Approach
                        </h3>
                        <div className="space-y-4">
                          {selectedStudyData.solution.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-4 p-4 bg-gray-800/50 rounded-lg"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-green-400 text-black rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1 space-y-2">
                                {(() => {
                                  const lines = item.split('\n');
                                  const elements: React.ReactNode[] = [];
                                  let i = 0;
                                  while (i < lines.length) {
                                    const line = lines[i];
                                    if (line.startsWith('```')) {
                                      const blockLines: string[] = [];
                                      i++;
                                      while (i < lines.length && !lines[i].startsWith('```')) {
                                        blockLines.push(lines[i]);
                                        i++;
                                      }
                                      i++; // skip closing fence
                                      elements.push(
                                        <pre key={elements.length} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 overflow-x-auto">
                                          <code className="text-sm text-green-400 font-mono whitespace-pre">{blockLines.join('\n')}</code>
                                        </pre>
                                      );
                                      continue;
                                    }
                                    const isQuery = line.startsWith('Query:');
                                    const isCode = /^(CREATE|ALTER|INSERT|SELECT|DROP|UPDATE|BEGIN|COMMIT|SET)\s/.test(line) || /^(await\s+)?db\.\w+/.test(line) || /^(const|let|new|await|import)\s.*[;{]$|^\}.*;?$/.test(line) || isQuery;
                                    if (isCode) {
                                      elements.push(
                                        <code
                                          key={elements.length}
                                          className="block bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-green-400 font-mono overflow-x-auto"
                                        >
                                          {isQuery && <span className="text-gray-500">Query: </span>}
                                          {isQuery ? line.replace(/^Query:\s*/, '') : line}
                                        </code>
                                      );
                                    } else {
                                      elements.push(
                                        <p key={elements.length} className="text-gray-300 leading-relaxed">
                                          {line}
                                        </p>
                                      );
                                    }
                                    i++;
                                  }
                                  return elements;
                                })()}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'results' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Impact & Results
                        </h3>

                        {/* Impact Metrics */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {Object.entries(selectedStudyData.impactMetrics).map(([key, metrics]) => (
                            <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                {getIconForMetric(key)}
                                <h4 className="font-bold text-white capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                              </div>
                              
                              {key === 'deploymentTime' && metrics && (metrics as any).before && (metrics as any).after && (metrics as any).improvement && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Before</span>
                                    <span className="text-red-400">{(metrics as any).before}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">After</span>
                                    <span className="text-green-400">{(metrics as any).after}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Improvement</span>
                                    <span className="text-green-400">-{(metrics as any).improvement}</span>
                                  </div>
                                </div>
                              )}

                              {key === 'cost' && metrics && (metrics as any).before && (metrics as any).after && (metrics as any).reduction && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Before</span>
                                    <span className="text-red-400">{(metrics as any).before}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">After</span>
                                    <span className="text-green-400">{(metrics as any).after}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Reduction</span>
                                    <span className="text-green-400">-{(metrics as any).reduction}</span>
                                  </div>
                                </div>
                              )}

                              {key === 'availability' && metrics && 'uptime' in metrics && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Uptime</span>
                                    <span className="text-green-400">{(metrics as any).uptime}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Improvement</span>
                                    <span className="text-green-400">+{(metrics as any).improvement}</span>
                                  </div>
                                </div>
                              )}

                              {key === 'scalability' && metrics && 'capacity' in metrics && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Capacity</span>
                                    <span className="text-green-400">{(metrics as any).capacity}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Improvement</span>
                                    <span className="text-green-400">+{(metrics as any).improvement}</span>
                                  </div>
                                </div>
                              )}

                              {key === 'performance' && metrics && 'improvement' in metrics && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Performance Gain</span>
                                    <span className="text-green-400">+{(metrics as any).improvement}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Comparison Table */}
                        {selectedStudyData.comparisonTable && (
                          <div className="overflow-x-auto mb-6 rounded-lg border border-gray-700">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="bg-gray-800">
                                  {selectedStudyData.comparisonTable.headers.map((header, hIndex) => (
                                    <th key={hIndex} className="px-4 py-3 font-bold text-green-400 border-b border-gray-700">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedStudyData.comparisonTable.rows.map((row, rIndex) => (
                                  <tr key={rIndex} className={rIndex % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'}>
                                    {row.map((cell, cIndex) => (
                                      <td key={cIndex} className="px-4 py-3 text-gray-300 border-b border-gray-800 align-top">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Impact List */}
                        <div className="space-y-3">
                          {selectedStudyData.impact.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-300 leading-relaxed">{item}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-400/30 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            INTERESTED_IN_A_SIMILAR_PROJECT?
          </h2>
          <p className="text-green-200 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can transform your infrastructure and achieve similar results for your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InteractiveButton variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Start Your Project
            </InteractiveButton>
            
            <InteractiveButton variant="outline" icon={<FileText className="w-4 h-4" />}>
              Download Case Study PDF
            </InteractiveButton>
          </div>
        </motion.section>
      </div>
    </AnimatedBackground>
  );
};

export default EnhancedCaseStudies;