/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://llm-to-sms.vercel.app/:path*',
      },
    ]
  },
  
}

module.exports = nextConfig
