import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    'rc-util',
    "rc-picker",
    "rc-pagination",
    "@ant-design/icons-svg"
  ]
};
const nextConfig = {
  output: 'export',
}

export default nextConfig;