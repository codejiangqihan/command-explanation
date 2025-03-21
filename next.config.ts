import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: [
    'rc-util',
    "rc-picker",
    "rc-pagination",
    "@rc-component/util",
    "@ant-design/icons-svg"
  ]
};

export default nextConfig;
