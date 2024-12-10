/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://tech0-gen-8-step3-testapp-py2-26.azurewebsites.net'
  }
}

module.exports = nextConfig