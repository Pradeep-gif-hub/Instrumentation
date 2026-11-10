import mermaid from 'mermaid';
import { useEffect, useId, useState } from 'react';
import { useApp } from '@/context/AppContext';

export function MermaidDiagram({ title, code }: { title?: string; code: string }) {
  const { theme } = useApp();
  const rawId = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'light' ? 'neutral' : 'dark',
          themeVariables:
            theme === 'light'
              ? {
                  primaryColor: '#ffffff',
                  primaryTextColor: '#141414',
                  primaryBorderColor: '#2F5F8A',
                  lineColor: '#525252',
                  secondaryColor: '#f2f2f2',
                }
              : {
                  primaryColor: '#2b2b2b',
                  primaryTextColor: '#f4f4f4',
                  primaryBorderColor: '#7FB3DE',
                  lineColor: '#a6a6a6',
                  secondaryColor: '#333333',
                  tertiaryColor: '#1a1a1a',
                },
          fontFamily: 'Urbanist, system-ui, sans-serif',
        });
        const { svg: rendered } = await mermaid.render(`mmd-${rawId}-${theme}`, code);
        if (mounted) {
          setSvg(rendered);
          setErr('');
        }
      } catch (e) {
        if (mounted) setErr(e instanceof Error ? e.message : 'Diagram render error');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [code, theme, rawId]);

  return (
    <div className="sub p-4">
      {title && <p className="eyebrow mb-3">{title}</p>}
      {err ? (
        <pre className="mono overflow-x-auto text-xs text-[var(--st-on-var)]">{code}</pre>
      ) : (
        <div
          className="flex justify-center overflow-x-auto py-1 [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}

