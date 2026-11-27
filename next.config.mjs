/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page's animations are wired up once against the rendered DOM,
  // so we skip React's dev-only double effect run.
  reactStrictMode: false,
};
export default nextConfig;
