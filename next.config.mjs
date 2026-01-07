/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Wajib untuk GitHub Pages (Static Site Generation)
  basePath: '/copy', // Ganti sesuai nama repository Anda
  assetPrefix: '/copy', 
  images: {
    unoptimized: true, // GitHub Pages tidak mendukung optimasi gambar bawaan Next.js
  },
};

export default nextConfig;
