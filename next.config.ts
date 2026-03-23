import { withContentCollections } from '@content-collections/next'
import withMDX from '@next/mdx'
import { baseConfig, withAnalyzer } from '@thedaviddias/config-next'
import type { NextConfig } from 'next'

export const INTERNAL_PACKAGES = [
  '@thedaviddias/design-system',
  '@thedaviddias/config-next',
  '@thedaviddias/config-typescript',
  '@thedaviddias/content',
  '@thedaviddias/logging',
  '@thedaviddias/utils'
]

let nextConfig: NextConfig = {
  ...baseConfig,

  transpilePackages: INTERNAL_PACKAGES,

  pageExtensions: ['mdx', 'ts', 'tsx'],

  // Configure logging behavior
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  },

  // Configure Turbopack (default bundler in Next.js 16)
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    resolveAlias: {
      crypto: { browser: './turbopack-empty.ts' },
      stream: { browser: './turbopack-empty.ts' },
      buffer: { browser: './turbopack-empty.ts' },
      util: { browser: './turbopack-empty.ts' },
      fs: { browser: './turbopack-empty.ts' },
      path: { browser: './turbopack-empty.ts' },
      'node:crypto': { browser: './turbopack-empty.ts' },
      'node:stream': { browser: './turbopack-empty.ts' },
      'node:buffer': { browser: './turbopack-empty.ts' },
      'node:util': { browser: './turbopack-empty.ts' },
      'node:fs': { browser: './turbopack-empty.ts' },
      'node:path': { browser: './turbopack-empty.ts' }
    }
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**'
      },
      {
        protocol: 'https',
        hostname: 't0.gstatic.com',
        pathname: '/faviconV2/**'
      },
      {
        protocol: 'https',
        hostname: 'icon.horse',
        pathname: '/icon/**'
      }
    ]
  },

  redirects: async () => {
    return [
      {
        source: '/news',
        destination: '/',
        permanent: false
      },
      {
        source: '/website/:path*',
        destination: '/websites/:path*',
        permanent: true
      },
      {
        // Redirect old website URLs to new ones with -llms-txt suffix
        source: '/websites/:slug((?!.*-llms-txt).*)',
        destination: '/websites/:slug-llms-txt',
        permanent: true
      }
    ]
  }
}

// Apply other plugins first
nextConfig = withMDX()(nextConfig)

if (process.env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig)
}

// withContentCollections must be the outermost wrapper
export default withContentCollections(nextConfig)
