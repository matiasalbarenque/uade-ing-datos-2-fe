import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path, { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = (a) => resolve(__dirname, a);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/*': dir('./src/*'),
      '@assets': dir('./src/assets'),
      '@atoms': dir('./src/components/atoms'),
      '@constants': dir('./src/assets/constants'),
      '@components': dir('./src/components'),
      '@hooks': dir('./src/hooks'),
      '@layouts': dir('./src/components/layouts'),
      '@molecules': dir('./src/components/molecules'),
      '@organisms': dir('./src/components/organisms'),
      '@services': dir('./src/services'),
      '@providers': dir('./src/providers'),
    },
  },
});
