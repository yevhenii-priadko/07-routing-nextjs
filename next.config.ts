import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: '/notes',
        destination: '/notes/filter/all',
        permanent: true, // Сервер миттєво перенаправить на сторінку з працюючим сайдбаром
      },
    ]
  },
}

export default nextConfig
