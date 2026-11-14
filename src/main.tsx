import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Lock In: tokens first, then the typography utilities, then component styles.
import '@stillxp/tokens/css';
import '@stillxp/tokens/css/typography';
import '@stillxp/react/styles.css';
import './styles.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
