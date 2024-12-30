/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8181'
  },
  output: 'standalone'
}

module.exports = nextConfig