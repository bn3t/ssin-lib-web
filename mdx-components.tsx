import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Headings
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mb-4 mt-8 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">
        {children}
      </h4>
    ),
    // Paragraphs
    p: ({ children }) => (
      <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
    ),
    // Lists
    ul: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2 mb-4 text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-2 mb-4 text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    // Code - inline
    code: ({ children, className }) => {
      // Check if this is inside a pre (code block) - className will be set by MDX for code blocks
      if (className) {
        return <code className={className}>{children}</code>;
      }
      // Inline code
      return (
        <code className="px-1.5 py-0.5 bg-muted text-foreground rounded text-sm font-mono">
          {children}
        </code>
      );
    },
    // Code blocks
    pre: ({ children }) => (
      <pre className="bg-muted/50 border border-border p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
        {children}
      </blockquote>
    ),
    // Strong/emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    // Horizontal rule
    hr: () => <hr className="border-border my-8" />,
  };
}
