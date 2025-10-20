/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module = config.module || {};
        config.module.exprContextCritical = false;
        return config;
      },
};

export default nextConfig;
