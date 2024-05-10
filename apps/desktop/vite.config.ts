import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import reactNativeWeb from "vite-plugin-react-native-web";
import createExternal from 'vite-plugin-external';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@mneme/desktop': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(
      {
        babel: {
          parserOpts: {
            plugins: ['decorators-legacy'],
          },
        },
      }
    ),
    reactNativeWeb(),
  ],
})
