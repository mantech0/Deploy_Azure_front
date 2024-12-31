/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://tech0-gen-8-step3-testapp-node2-26.azurewebsites.net' 
    : '',
  images: {
    domains: ['tech0-gen-8-step3-testapp-node2-26.azurewebsites.net']
  }
}

module.exports = nextConfig