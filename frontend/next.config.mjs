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
                source: "/:path*",
                destination: "https://openapi.naver.com/:path*",
            }
        ]
    }
};

export default nextConfig;
