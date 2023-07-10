const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ignoreDuringBuilds: true,
  reactStrictMode: true,
  swcMinify: true,
  // webpack5: false,
  // sassOptions: {
  //   includePaths: [path.join(__dirname, "styles")],
  // },
  images: {
    domains: ["img.pokemondb.net"],
  },
};

module.exports = nextConfig;
