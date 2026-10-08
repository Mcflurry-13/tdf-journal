import { isValidElement, useState, type ComponentProps, type ReactElement } from 'react';
import { readCodeFile, resolveAsset } from '../content';
import { absoluteUrl } from '../format';
import { useWeekDir } from '../week-context';

const COLLAPSE_ABOVE = 15; // web: collapse when longer than this
const PREVIEW_LINES = 12; //  web: lines shown while collapsed
const PRINT_MAX = 80; //      print: longer than this → only the head is printed
const PRINT_HEAD = 40;

interface Props {
  /** Inline code. */
  code?: string;
  /** Or a file in the week folder, e.g. ./files/turntable.ino — also offered as a download. */
  src?: string;
  lang?: string;
  /** Display name; defaults to the file name of `src`. */
  file?: string;
}

export function CodeBlock({ code, src, lang, file }: Props) {
  const dir = useWeekDir();
  const text = (code ?? (src ? readCodeFile(dir, src) : undefined) ?? `// Code file not found: ${src}`).replace(/\n$/, '');
  const fileUrl = src ? resolveAsset(dir, src) : undefined;
  const name = file ?? src?.split('/').pop();
  const lines = text.split('\n');
  const total = lines.length;
  const collapsible = total > COLLAPSE_ABOVE;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Three segments so web-collapse and print-truncation are pure CSS.
  const head = lines.slice(0, PREVIEW_LINES).join('\n');
  const mid = lines.slice(PREVIEW_LINES, PRINT_HEAD).join('\n');
  const tail = lines.slice(PRINT_HEAD).join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  const cls = ['code', collapsible && !open ? 'is-collapsed' : '', total > PRINT_MAX ? 'is-long' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="code-head">
        <span className="mono">
          {[lang?.toUpperCase(), name].filter(Boolean).join(' · ') || 'CODE'}
          <span className="print-only"> · {total} lines</span>
        </span>
        <span className="code-actions no-print">
          {fileUrl && (
            <a className="mono" href={fileUrl} download={name || true}>
              Download
            </a>
          )}
          <button type="button" className="btn btn-small" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <pre className="code-body">
        <code>
          {head}
          {mid && <span className="code-mid">{'\n' + mid}</span>}
          {tail && <span className="code-tail">{'\n' + tail}</span>}
        </code>
      </pre>
      {total > PRINT_MAX && (
        <p className="print-only code-note mono">
          Lines {PRINT_HEAD + 1}–{total} not printed. Full file: {fileUrl ? absoluteUrl(fileUrl) : 'see the web version'}
        </p>
      )}
      {collapsible && (
        <button type="button" className="code-toggle no-print" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Show less' : `Show all · ${total} lines`}
        </button>
      )}
    </div>
  );
}

/** Fenced ```lang blocks in MDX render through CodeBlock too. */
export function Pre({ children, ...rest }: ComponentProps<'pre'>) {
  if (isValidElement(children)) {
    const el = children as ReactElement<{ className?: string; children?: unknown }>;
    const lang = el.props.className?.replace(/^language-/, '');
    return <CodeBlock code={String(el.props.children ?? '')} lang={lang} />;
  }
  return <pre {...rest}>{children}</pre>;
}
