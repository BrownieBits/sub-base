/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vangogh.teespring.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'amaze-dash.netlify.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
