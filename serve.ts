// Simple static file server for the www directory
import { serve } from 'bun';

const server = serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html for root
    if (path === '/') {
      path = '/index.html';
    }

    // Serve files from www directory
    const filePath = `./www${path}`;
    const file = Bun.file(filePath);

    return new Response(file);
  },
});

console.log(`Server running at http://localhost:${server.port}/`);
