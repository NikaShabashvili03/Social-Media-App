/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    images: {
        domains: [
          "res.cloudinary.com",
          "localhost"
        ]
    }
};

export default nextConfig;
