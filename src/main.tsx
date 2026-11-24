import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Lock In: tokens first, then the typography utilities, then component styles.
import '@stillxp/tokens/css';
import '@stillxp/tokens/css/typography';
import '@stillxp/react/styles.css';
import './styles.css';

import { App } from './App';
import { CaseStudyPage } from './CaseStudyPage';

// The content editor only exists in `npm run dev`; the production build drops it.
const Editor = import.meta.env.DEV ? lazy(() => import('./Editor')) : null;

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (Editor && hash === '#edit') {
    return (
      <Suspense fallback={null}>
        <Editor />
      </Suspense>
    );
  }
  // Case studies live at /work/<slug>/. The build writes an HTML file for each one.
  const study = window.location.pathname.match(/^\/work\/([^/]+)\/?$/);
  if (study) return <CaseStudyPage slug={decodeURIComponent(study[1])} />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
