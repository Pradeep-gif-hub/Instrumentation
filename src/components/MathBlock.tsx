import katex from 'katex';
import { useMemo } from 'react';

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function MathBlock({ latex, displayMode = true, className = '' }: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return '';
    }
  }, [latex, displayMode]);

  if (!html) {
    return <code className={`code-mono text-[14px] ${className}`}>{latex}</code>;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

