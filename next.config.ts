import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.r2.cloudflarestorage.com',
				port: '',
				pathname: '/**'
			}
		]
	}
};

export default nextConfig;
