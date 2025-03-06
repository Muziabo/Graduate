/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // appDir: true, // Enables App Router
    },
    compiler: {
        removeConsole: false,
    },
    images: {
        domains: ['loremflickr.com', 'picsum.photos'],
    },
};

module.exports = nextConfig;
