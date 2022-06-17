let HOST_URL = '';
if (process.env.NEXT_PUBLIC_NETLIFY) {
  HOST_URL = 'https://game-list-preview.netlify.app';
} else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
  HOST_URL = 'https://game-list-preview.vercel.app';
} else {
  HOST_URL = 'http://localhost:3000';
}

export { HOST_URL };
