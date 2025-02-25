import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  children: string;
};

function NonMemoizedMarkdown({ children }: MarkdownProps) {
  const components: import("react-markdown").Components = {
    ol: ({ children, ...props }) => (
      <ol className="list-decimal ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="py-1" {...props}>
        {children}
      </li>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside ml-4" {...props}>
        {children}
      </ul>
    ),
    strong: ({ children, ...props }) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),
    a: ({ children, ...props }) => (
      <a className="text-sky-600" {...props}>
        {children}
      </a>
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

export default Markdown;
