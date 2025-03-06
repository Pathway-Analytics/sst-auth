import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

export default defineConfig(({ mode }) => {
	const stage = process.env.SST_STAGE || "chewitt"; // Default to 'local' if not set
	const apiDomain = process.env.SST_API_URL || `https://api-${stage}.pathwayanalytics.com`;
	
	return {
	  plugins: [sveltekit()],
	  server: {
		https: {
		  key: readFileSync("./certs/key.pem"),
		  cert: readFileSync("./certs/cert.pem"),
		},
		port: 5173,
		host: "local.pathwayanalytics.com",
	  },
	  define: {
		  "import.meta.env.SST_API_URL": JSON.stringify(apiDomain), // Injects API_URL into browser
	  },
	};
  });