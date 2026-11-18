import React, { useState, useMemo } from 'react';
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
  Eye,
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
  views: string;
  likes: string;
  comments: string;
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
    views: "1.8k",
    likes: "98",
    comments: "15",
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
    id: 3,
    title: "DevOps Trends 2025: AI, GitOps, and Cloud Native Revolution",
    category: "DevOps",
    difficulty: "Beginner",
    readTime: "6 min read",
    date: "2025-01-05",
    featured: false,
    views: "3.2k",
    likes: "234",
    comments: "41",
    excerpt: "Explore the latest DevOps trends shaping the industry in 2025, from AI-powered automation to enhanced GitOps workflows.",
    tags: ["Trends", "AI", "GitOps", "Cloud Native", "Automation"],
    content: `
# DevOps Trends 2025: AI, GitOps, and Cloud Native Revolution

The DevOps landscape continues to evolve rapidly. Let's explore the key trends that will shape the industry in 2025.

## AI-Powered Automation

AI is transforming how we approach DevOps:
- Intelligent incident detection and response
- Automated capacity planning
- Predictive maintenance
- Smart resource optimization

## Enhanced GitOps Workflows

GitOps continues to mature:
- Multi-cluster synchronization
- Progressive delivery strategies
- Policy-as-code enforcement
- Enhanced rollback capabilities

## Cloud Native Security

Security is becoming more integrated:
- Zero-trust architectures
- DevSecOps pipelines
- Container image scanning
- Runtime security monitoring

## Platform Engineering

Organizations are building internal platforms:
- Self-service developer portals
- Standardized deployment pipelines
- Automated compliance checks
- Improved developer experience

## Key Takeaways

1. Embrace automation, but maintain human oversight
2. Invest in security from day one
3. Focus on developer experience
4. Stay adaptable to new technologies

The future of DevOps is bright, with these trends setting the stage for more efficient and secure software delivery.
    `
  },
  {
    id: 4,
    title: "Real-time Communication: WebSocket Architecture with Node.js",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "10 min read",
    date: "2024-12-28",
    featured: true,
    views: "1.9k",
    likes: "127",
    comments: "19",
    excerpt: "Build scalable real-time applications using WebSocket architecture with Node.js, Redis, and message queues.",
    tags: ["WebSocket", "Node.js", "Redis", "Real-time", "Architecture"],
    content: `
# Real-time Communication: WebSocket Architecture with Node.js

Real-time communication has become essential for modern applications. This guide covers building scalable WebSocket applications.

## Architecture Overview

\`\`\`
Client -> Load Balancer -> WebSocket Server -> Redis Pub/Sub -> Database
                                    -> Message Queue -> Background Workers
\`\`\`

## WebSocket Server Setup

\`\`\`javascript
const WebSocket = require('ws');
const redis = require('redis');

class WebSocketServer {
  constructor(port) {
    this.wss = new WebSocket.Server({ port });
    this.redisClient = redis.createClient();
    this.setupWebSocketHandlers();
  }
  
  setupWebSocketHandlers() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');
      
      ws.on('message', (message) => {
        this.handleMessage(ws, message);
      });
      
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}
\`\`\`

## Scaling Strategies

1. **Horizontal Scaling**: Use Redis for session sharing
2. **Load Balancing**: Implement sticky sessions
3. **Message Queues**: Handle high message volumes
4. **Database Optimization**: Use efficient data structures

## Best Practices

- Implement proper error handling
- Use connection pooling
- Monitor memory usage
- Implement rate limiting

This architecture provides a solid foundation for building real-time applications that can scale to thousands of concurrent users.
    `
  },
  {
    id: 6,
    title: "DevOps Lifecycle",
    category: "DevOps",
    difficulty: "Beginner",
    readTime: "3 min read",
    date: "2026-07-21",
    featured: true,
    views: "412",
    likes: "34",
    comments: "4",
    excerpt: "A raw reference note on the DevOps lifecycle: the six phases of the infinity loop (Plan, Code, Build/Test, Release, Deploy, Operate, Monitor), what happens in each, and the key tools for each phase.",
    tags: ["DevOps", "CI/CD", "Lifecycle", "Reference"],
    content: `
The **DevOps lifecycle** is a continuous loop that integrates software development (**Dev**) and IT operations (**Ops**). Unlike traditional linear models (like Waterfall), DevOps focuses on continuous iteration, automated testing, rapid deployment, and constant monitoring.

It is usually visualized as an **infinity loop ($\\infty$)**, representing an ongoing process without a hard end point.

---

## Phases of the DevOps Lifecycle

\`\`\`
    [ Plan ] ---> [ Code ] ---> [ Build ] ---> [ Test ]
       ^                                          |
       |                                          v
  [ Monitor ] <--- [ Operate ] <--- [ Deploy ] <--- [ Release ]

\`\`\`

### 1. Continuous Planning

* **Goal:** Define business requirements, track issues, and design application architecture.
* **What happens:** Teams plan upcoming features, bug fixes, and improvements in small, manageable iterations (sprints).
* **Key Tools:** Jira, Trello, GitHub Issues.

### 2. Continuous Integration & Code Development

* **Goal:** Write code and frequently merge changes into a shared central repository.
* **What happens:** Developers write code in local environments and commit changes regularly. Automated workflows build the code, check code style, and ensure new commits don't break existing features.
* **Key Tools:** Git, GitHub, GitLab, Bitbucket.

### 3. Continuous Testing

* **Goal:** Identify bugs and security vulnerabilities early in the development cycle (**Shift-Left Testing**).
* **What happens:** Automated test suites (Unit, Integration, End-to-End, Security scans) execute automatically whenever new code is merged.
* **Key Tools:** Jest, Cypress, Selenium, SonarQube.

### 4. Continuous Delivery & Deployment (CD)

* **Goal:** Deliver code changes to production quickly, reliably, and safely.
* **What happens:**
* **Continuous Delivery:** Code is automatically built, tested, and packaged into standard artifacts (e.g., Docker images), ready for manual release approval.
* **Continuous Deployment:** Every change that passes automated tests is automatically deployed straight to production environments without human intervention.


* **Key Tools:** GitHub Actions, Jenkins, ArgoCD, Flux.

### 5. Continuous Provisioning & Operations

* **Goal:** Manage, scale, and maintain infrastructure reliably.
* **What happens:** Infrastructure is defined as code (**IaC**) so environments can be created or destroyed automatically. System performance and scalability are handled seamlessly.
* **Key Tools:** Terraform, Ansible, Docker, Kubernetes.

### 6. Continuous Monitoring & Observability

* **Goal:** Track application health, performance, user experience, and security in real time.
* **What happens:** Logs, metrics, and distributed traces are collected from servers and applications to detect anomalies, analyze errors, and provide feedback directly to the planning phase for the next development cycle.
* **Key Tools:** Prometheus, Grafana, ELK Stack (Elasticsearch, Logstash, Kibana), Datadog.

---

## Why the Lifecycle Matters

* **Faster Time-to-Market:** Features reach end-users in hours or days instead of months.
* **Higher Reliability:** Automated tests and continuous feedback catch failures before they impact production.
* **Shorter Recovery Time (MTTR):** Quick identification and rolling out of hotfixes or automatic rollbacks.
    `
  },
  {
    id: 7,
    title: "Simulating 3D in Three.js with the webgpu-claude-skill",
    category: "Full-Stack",
    difficulty: "Intermediate",
    readTime: "10 min read",
    date: "2026-07-30",
    featured: false,
    views: "0",
    likes: "0",
    comments: "0",
    excerpt: "How I used dgreenheck's webgpu-claude-skill — a packaged Claude Code skill for WebGPU + TSL — to go from zero to a working 3D particle simulation in Three.js, and what's inside the skill that makes that possible.",
    tags: ["Three.js", "WebGPU", "TSL", "Claude Code", "AI Tooling"],
    content: `
# Simulating 3D in Three.js with the webgpu-claude-skill

[dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill) is a Claude Code **skill** — a packaged bundle of docs, examples, and templates that an agent loads on demand instead of relying on stale training data. Its subject is Three.js's newest renderer, WebGPU, and its node-based shader language, **TSL (Three.js Shading Language)**. Rather than write a generic "how WebGPU works" tutorial, this post covers how the skill itself is structured and how I used it to drive an actual 3D simulation build.

## What a Claude Code skill actually is

A skill is a folder of markdown + code that gets injected into the agent's context only when relevant, keyed off a trigger description. This one triggers on prompts mentioning WebGPU, TSL, node materials, or GPU compute in Three.js. Once loaded, the agent has:

\`\`\`
webgpu-claude-skill/
├── docs/
│   ├── core-concepts.md       # types, operators, uniforms, control flow
│   ├── materials.md           # node materials and all properties
│   ├── compute-shaders.md     # GPU compute with instanced arrays
│   ├── post-processing.md     # built-in and custom effects
│   ├── wgsl-integration.md    # custom WGSL functions
│   ├── device-loss.md         # handling GPU device loss and recovery
│   └── limits-and-features.md # WebGPU device limits and optional features
├── examples/
│   ├── basic-setup.js
│   ├── custom-material.js
│   ├── particle-system.js
│   └── earth-shader.js
├── templates/
│   ├── webgpu-project.js
│   └── compute-shader.js
└── REFERENCE.md                # quick cheatsheet
\`\`\`

That structure matters more than it looks: instead of one giant prompt, the agent can pull just \`docs/compute-shaders.md\` when building a particle system, or just \`materials.md\` when writing a custom shader — keeping context focused and answers accurate to the current TSL API rather than an older GLSL-era mental model.

## Using the skill: renderer setup

Asking the agent to "set up a WebGPU renderer with Three.js" pulls the \`templates/webgpu-project.js\` starter, which enforces the one detail people most often get wrong — importing from the WebGPU-specific entry points, not the classic \`three\` package:

\`\`\`javascript
import * as THREE from 'three/webgpu';
import { color, time, oscSine } from 'three/tsl';

const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init(); // WebGPU initialization is async
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
\`\`\`

Notice the pattern the skill enforces: import from \`three/webgpu\` and \`three/tsl\`, never the classic \`three\` package — the node material system doesn't exist on the WebGL-only entry point, and it's the single most common mistake when adapting older Three.js tutorials.

## Using the skill: node-based materials

Asking for "a custom shader material" pulls \`docs/materials.md\` and \`examples/custom-material.js\`. The skill's core lesson here is a mental-model shift: instead of setting \`material.color\` or \`material.map\` directly, you assign **nodes** to properties like \`colorNode\`, \`roughnessNode\`, and \`positionNode\`.

\`\`\`javascript
const material = new THREE.MeshStandardNodeMaterial();

// Animate color with a sine oscillator driven by elapsed time
material.colorNode = color(0x00ff88).mul(oscSine(time));

// Vertex displacement for a simple "breathing" sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
\`\`\`

The skill also flags TSL's **method-chaining** convention, which trips people up coming from GLSL. What would be \`sin(time * 2.0 + offset) * 0.5 + 0.5\` becomes:

\`\`\`javascript
time.mul(2.0).add(offset).sin().mul(0.5).add(0.5)
\`\`\`

## Using the skill: GPU compute for the simulation itself

This is the part that made the skill worth pulling in — \`docs/compute-shaders.md\` and \`examples/particle-system.js\` cover **GPU compute with instanced arrays**, which is what actually simulates motion for thousands of objects without a CPU round-trip per frame:

\`\`\`javascript
import { instancedArray, Fn, vec3, instanceIndex } from 'three/tsl';

const particleCount = 50_000;
const positionBuffer = instancedArray(particleCount, 'vec3');

const computeUpdate = Fn(() => {
  const pos = positionBuffer.element(instanceIndex);
  pos.addAssign(vec3(0, -0.01, 0)); // simple gravity simulation
})().compute(particleCount);

// Each frame:
renderer.computeAsync(computeUpdate);
\`\`\`

Pair this buffer with a \`THREE.InstancedMesh\`, or a points material whose \`positionNode\` reads from \`positionBuffer\`, to render the simulated particles. This is directly lifted from the skill's \`templates/compute-shader.js\` template rather than assembled from scratch.

## Using the skill: reusable shader logic

For effects you'll reuse across materials — a Fresnel rim light, for example — the skill's core-concepts doc shows wrapping the logic in \`Fn()\`:

\`\`\`javascript
import { Fn, normalWorld, positionViewDirection, float } from 'three/tsl';

const fresnel = Fn(([power = 2.0]) => {
  const nDotV = normalWorld.dot(positionViewDirection).saturate();
  return float(1.0).sub(nDotV).pow(power);
});

material.emissiveNode = color(0x00ff88).mul(fresnel(3.0));
\`\`\`

## Using the skill: post-processing and device loss

\`docs/post-processing.md\` covers composing effects declaratively:

\`\`\`javascript
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

const scenePass = pass(scene, camera);
const bloomPass = bloom(scenePass, 1.0, 0.4, 0.1);

const postProcessing = new THREE.PostProcessing(renderer);
postProcessing.outputNode = scenePass.add(bloomPass);
\`\`\`

And \`docs/device-loss.md\` covers a failure mode that's easy to miss if you're only used to WebGL: WebGPU devices can be lost outright (driver crash, resource limits, tab backgrounding), so production code needs an explicit recovery path:

\`\`\`javascript
renderer.onDeviceLost((info) => {
  console.warn('WebGPU device lost:', info.message);
  // Recreate renderer and re-upload scene resources
});
\`\`\`

## Putting it together

The full render loop combines the compute pass with the render/post-processing pass:

\`\`\`javascript
renderer.setAnimationLoop(() => {
  renderer.computeAsync(computeUpdate);
  postProcessing.render();
});
\`\`\`

## Why go through the skill instead of just asking the model

Three.js's WebGPU/TSL API is new enough that a model's training data is likely to blend it with older GLSL-based APIs, or with outdated pre-release TSL syntax. The skill sidesteps that by giving the agent current, curated reference material — docs, working examples, and templates — to pull from on demand, so what comes back matches the actual current API instead of a plausible-sounding blend of old and new.

## Key Takeaways

1. A Claude Code skill is a folder of docs/examples/templates loaded into context only when its trigger matches — here, anything mentioning WebGPU, TSL, or Three.js GPU compute.
2. It fixes the two mistakes people make most: wrong import path (\`three/webgpu\` / \`three/tsl\`, not \`three\`) and treating node materials like flat properties.
3. GPU compute via \`instancedArray\` + \`.compute()\` — sourced from the skill's compute-shader template — is what makes large-scale simulation practical in the browser.
4. Device-loss handling is documented explicitly in the skill because it's a real WebGPU failure mode, not an edge case worth skipping.
5. Reference: [dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill).
    `
  }
];

const categories = ['DevOps', 'Cloud Infrastructure', 'Full-Stack'];

const EnhancedBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogViews, setBlogViews] = useState<{[key: number]: number}>({});

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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return parseInt(b.views.replace('k', '000')) - parseInt(a.views.replace('k', '000'));
        case 'likes':
          return parseInt(b.likes) - parseInt(a.likes);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [selectedCategory, searchTerm, sortBy]);

  const featuredPosts = blogPosts.filter(post => post.featured);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    // Simulate real-time view increment
    setBlogViews(prev => ({
      ...prev,
      [post.id]: (prev[post.id] || parseInt(post.views.replace('k', '000'))) + 1
    }));
  };

  const getPostViews = (post: BlogPost) => {
    const views = blogViews[post.id] || parseInt(post.views.replace('k', '000'));
    return views > 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString();
  };

  const getTotalViews = () => {
    return blogPosts.reduce((total, post) => {
      return total + (blogViews[post.id] || parseInt(post.views.replace('k', '000')));
    }, 0);
  };

  const totalViews = getTotalViews();
  const totalViewsFormatted = totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString();

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
            value="4"
            icon={<BookOpen className="w-6 h-6" />}
            color="completed"
          />
          <StatsCard
            title="Total Views"
            value={totalViewsFormatted}
            change="Real-time tracking"
            icon={<Eye className="w-6 h-6" />}
            color="completed"
            trend="up"
          />
          <StatsCard
            title="Engagement Rate"
            value="72%"
            change="Active readership"
            icon={<Heart className="w-6 h-6" />}
            color="completed"
            trend="up"
          />
          <StatsCard
            title="Avg. Read Time"
            value="8 min"
            change="Industry average: 7 min"
            icon={<Clock className="w-6 h-6" />}
            color="completed"
            trend="up"
          />
        </motion.div>

        {/* Featured Posts */}
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
                      views={getPostViews(post)}
                      likes={post.likes}
                      comments={post.comments}
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
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes')}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-neutral-200 focus:outline-none focus:border-green-400"
          >
            <option value="date">Latest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
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
                    views={getPostViews(post)}
                    likes={post.likes}
                    comments={post.comments}
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
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{getPostViews(selectedPost)} views</span>
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