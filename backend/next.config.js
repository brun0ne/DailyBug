/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                ]
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: "/privacy",
                destination: "/privacy.html"
            },
            {
                source: "/terms",
                destination: "/terms.html"
            }
        ]
    }
}

module.exports = nextConfig
