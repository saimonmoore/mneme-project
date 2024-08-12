import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import reactNativeWeb from "vite-plugin-react-native-web";
// import createExternal from 'vite-plugin-external';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return ({
    base: './',
    define: {
      'process.env.OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
    },
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
}
);
