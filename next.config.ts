/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // appDir: true, // Enables App Router
    },
    compiler: {
        removeConsole: false,
    },
};

module.exports = nextConfig;
