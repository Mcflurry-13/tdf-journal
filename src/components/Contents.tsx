/**
 * Numbered contents for a week, built from the rendered rows ([data-toc],
 * set by Section and Entry) — never written by hand. Numbers match the rows.
 */
import { useEffect, useState, type RefObject } from 'react';

export interface TocItem {
  id: string;
  label: string;
  date?: string;
}

export function useTocItems(root: RefObject<HTMLElement>, key: string): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([]);
  useEffect(() => {
    const nodes = root.current?.querySelectorAll<HTMLElement>('[data-toc]') ?? [];
    setItems(
      Array.from(nodes).map((n) => ({ id: n.id, label: n.dataset.toc ?? '', date: n.dataset.tocDate })),
    );
  }, [root, key]);
  return items;
}

const num = (i: number) => String(i + 1).padStart(2, '0');

function List({ items, className }: { items: TocItem[]; className: string }) {
  return (
    <ol className={className}>
      {items.map((item, i) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>
            <span className="mono muted toc-num">{num(i)}</span>
            <span>
              {item.date && <span className="toc-date mono">{item.date}</span>}
              <span className="toc-label">{item.label}</span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Desktop: three-column numbered list under the week header. */
export function ContentsGrid({ items }: { items: TocItem[] }) {
  return (
    <nav className="toc-grid-wrap no-print" aria-label="Contents of this week">
      <List items={items} className="toc-grid" />
    </nav>
  );
}

/** Mobile: collapsed toggle. */
export function ContentsToggle({ items }: { items: TocItem[] }) {
  return (
    <details className="toc-mobile no-print">
      <summary className="mono">
        <span>Contents · {items.length}</span>
        <span aria-hidden="true">＋</span>
      </summary>
      <nav aria-label="Contents of this week">
        <List items={items} className="toc-list" />
      </nav>
    </details>
  );
}
