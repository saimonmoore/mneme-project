import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactNativeWeb from "vite-plugin-react-native-web";
import createExternal from 'vite-plugin-external';



// https://vitejs.dev/config/
export default defineConfig({
  base: './',
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
