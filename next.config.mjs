/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['antd', '@ant-design/cssinjs'],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack(config) {
        config.module = config.module || {};
        config.module.exprContextCritical = false;
        return config;
      },
};

export default nextConfig;
