/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["shopping-phinf.pstatic.net"],
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
        source: "/oauth2/:path*",
        destination: "http://localhost:8080/oauth2/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/oauth2/authorization/google",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
