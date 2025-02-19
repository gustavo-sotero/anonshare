import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 client using environment variables
export const s3Client = new S3Client({
	region: 'us-east-1',
	endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});
