import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @stillxp/* are linked from the sibling repo; make sure they share this app's React.
    dedupe: ['react', 'react-dom'],
  },
});
