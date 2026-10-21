import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts live in src/assets/fonts (no network needed in class); CSS stacks fall back to Georgia / system sans.
import './fonts.css';
import './styles.css';
import App from './App';




createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

if (parent !== window) document.documentElement.classList.add('journal-embed');
// Keep the journal embed fitted to the full page at every width.
new ResizeObserver(() => parent.postMessage({type:'ambient-preview-height',height:Math.ceil(document.querySelector('.page')?.getBoundingClientRect().height ?? document.body.scrollHeight)},location.origin)).observe(document.body);
