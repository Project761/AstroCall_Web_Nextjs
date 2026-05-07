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
    // devIndicators: {
    //     buildActivity: false
    // }
};
module.exports = nextConfig;
