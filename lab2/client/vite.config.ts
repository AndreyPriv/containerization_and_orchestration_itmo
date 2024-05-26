import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		APP_VERSION: JSON.stringify(pkg.version)
	},
	server: {
		port: parseInt(process.env.PORT ?? '3000'),
		host: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true
			}
		}
	},
	preview: {
		port: parseInt(process.env.PORT ?? '3000'),
		host: true
	}
})
