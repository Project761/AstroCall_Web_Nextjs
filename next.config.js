/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.astrocall.live",
            },
            {
                protocol: "https",
                hostname: "liveapi.astrocall.live",
            },
        ],
    },
    serverExternalPackages: ['react-icons'],
};

module.exports = nextConfig;