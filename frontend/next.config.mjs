/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['shopping-phinf.pstatic.net'],
    },
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: "/naverapi/:path*",
                destination: "https://openapi.naver.com/:path*",
            },
            {
                source: "/api/:path*",
                destination: "http://j10a301.p.ssafy.io:8080/:path*",
            }
        ]
    }
};

export default nextConfig;
