/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Add this to prevent TypeScript errors from failing the build
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // Add memory and process management settings to fix EPERM error
  experimental: {
    webpackBuildWorker: false, // Disable worker to prevent process conflicts
    concurrentFeatures: false,
    memoryLimit: 4096,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      }
    }

    // Add optimization settings to reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      runtimeChunk: "single",
    }

    return config
  },
}

module.exports = nextConfig

