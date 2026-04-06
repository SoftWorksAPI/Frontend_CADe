'use client'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown-renderer.css';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-renderer">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="md-h4" {...props} />,
          p: ({ node, ...props }) => <p className="md-p" {...props} />,
          strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
          em: ({ node, ...props }) => <em className="md-em" {...props} />,
          a: ({ node, ...props }) => <a className="md-a" target="_blank" rel="noopener noreferrer" {...props} />,
          code: ({ node, inline, ...props }) => 
            inline ? <code className="md-code-inline" {...props} /> : <code className="md-code-block" {...props} />,
          pre: ({ node, ...props }) => <pre className="md-pre" {...props} />,
          ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="md-ol" {...props} />,
          li: ({ node, ...props }) => <li className="md-li" {...props} />,
          table: ({ node, ...props }) => <table className="md-table" {...props} />,
          thead: ({ node, ...props }) => <thead className="md-thead" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="md-tbody" {...props} />,
          tr: ({ node, ...props }) => <tr className="md-tr" {...props} />,
          th: ({ node, ...props }) => <th className="md-th" {...props} />,
          td: ({ node, ...props }) => <td className="md-td" {...props} />,
          hr: ({ node, ...props }) => <hr className="md-hr" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="md-blockquote" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

