import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    'rc-util',
    "rc-picker",
    "rc-pagination",
    "@ant-design/icons-svg"
  ]
};
module.exports = {
  distDir: 'build',
};

export default nextConfig;