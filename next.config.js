module.exports = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
        // port: '',
        // pathname: '/my-bucket/**',
      },
    ],
  },
};
