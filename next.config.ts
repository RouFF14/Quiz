import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/Quiz" : "",
  assetPrefix: isGitHubPages ? "/Quiz/" : undefined,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/Quiz" : "" },
  typescript: { ignoreBuildErrors: isGitHubPages },
};

export default nextConfig;
