import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Star } from 'lucide-react';
import { AnimatedBackground, TechBadge } from '../components/visual/VisualComponents';
import CodeBlock from '../components/blog/CodeBlock';
import { getBlogPostById, getBlogPostBySlug } from '../data/blog';

// Turns `inline code` spans inside a text line into <code> elements.
const renderInline = (text: string): React.ReactNode[] =>
  text.split(/(`[^`]+`)/g).map((part, idx) =>
    part.length > 2 && part.startsWith('`') && part.endsWith('`') ? (
      <code key={idx} className="px-1.5 py-0.5 bg-gray-800 text-green-400 rounded text-[0.9em] font-mono">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    )
  );

// Minimal renderer for the blog content format: #/##/### headings, fenced code blocks, paragraphs.
const renderContent = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || undefined; // e.g. ```sql
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      elements.push(<CodeBlock key={elements.length} code={codeLines.join('\n')} language={language} />);
      continue;
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={elements.length} className="text-3xl font-bold text-neutral-200 mb-4">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={elements.length} className="text-2xl font-bold text-neutral-200 mb-3 mt-6">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={elements.length} className="text-xl font-bold text-neutral-200 mb-2 mt-4">{line.substring(4)}</h3>);
    } else if (line.trim()) {
      elements.push(<p key={elements.length} className="text-gray-300 leading-relaxed mb-4">{renderInline(line)}</p>);
    } else {
      elements.push(<br key={elements.length} />);
    }
    i++;
  }
  return elements;
};

const BackLink: React.FC = () => (
  <Link
    to="/blog"
    className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
  >
    <ArrowLeft size={16} />
    <span>cd ../blog</span>
  </Link>
);

const SITE_NAME = 'Dat Dao';

// Sets <title>, meta description and canonical for the current article, restores them on leave.
const useArticleMeta = (title: string | undefined, description: string | undefined) => {
  useEffect(() => {
    if (!title || !description) return;

    const previousTitle = document.title;
    document.title = `${title} | ${SITE_NAME}`;

    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const createdDescription = !descriptionTag;
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.name = 'description';
      document.head.appendChild(descriptionTag);
    }
    const previousDescription = descriptionTag.content;
    descriptionTag.content = description;

    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonicalTag;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    const previousCanonical = canonicalTag.href;
    // Same form as the prerendered pages (scripts/prerender.mjs): trailing slash, so there is one canonical URL.
    canonicalTag.href = `${window.location.origin}${window.location.pathname.replace(/\/?$/, '/')}`;

    return () => {
      document.title = previousTitle;
      if (createdDescription) descriptionTag.remove();
      else descriptionTag.content = previousDescription;
      if (createdCanonical) canonicalTag.remove();
      else canonicalTag.href = previousCanonical;
    };
  }, [title, description]);
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug);

  // Old links used the numeric id (/blog/10): send them to the slug URL, keeping them working.
  const legacyPost = post ? undefined : getBlogPostById(slug);

  useArticleMeta(post?.title, post?.excerpt);

  // Start each article at the top instead of keeping the list page's scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (legacyPost) {
    return <Navigate to={`/blog/${legacyPost.slug}`} replace />;
  }

  if (!post) {
    return (
      <AnimatedBackground>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="text-5xl text-neutral-600 mb-4">404</div>
          <p className="text-neutral-400 mb-8">Blog post not found.</p>
          <BackLink />
        </div>
      </AnimatedBackground>
    );
  }

  // The article body starts with a "# Title" line; the page header already shows the title.
  const body = post.content.replace(/^\s*# .*\n/, '');

  return (
    <AnimatedBackground>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackLink />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
        >
          <header className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <TechBadge name={post.category} category={post.category} size="sm" />
              <span className={`px-2 py-1 text-xs rounded ${
                post.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                post.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {post.difficulty}
              </span>
              {post.featured && <Star className="w-4 h-4 text-amber-600 fill-current" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-200 mb-2">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="prose prose-invert prose-green max-w-none">{renderContent(body)}</div>

            <div className="mt-6 pt-6 border-t border-gray-700 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-800 text-green-400 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        <div className="mt-8">
          <BackLink />
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default BlogPostPage;
