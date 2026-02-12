import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 8080,
  },
  build: {
    outDir:
      mode === 'production'
        ? 'dist/prod_build'
        : mode === 'development'
          ? 'dist/dev_build'
          : mode === 'qa'
            ? 'dist/qa_build'
            : 'dist/uat_build',
  },
}));
