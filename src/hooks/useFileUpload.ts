import { getPresignedUrl, notifyUploadComplete } from '@/services/fileService';
import type { FileInfo, UploadFormData, UploadState } from '@/types/file';
import { nanoid } from 'nanoid';
import { useState } from 'react';

const initialState: UploadState = {
	state: 'initial',
	progress: 0,
	generatedLink: '',
	fileInfo: null
};

export function useFileUpload() {
	const [uploadState, setUploadState] = useState<UploadState>(initialState);

	const handleUpload = async (data: UploadFormData) => {
		const { file, expirationTime, oneTimeDownload, description } = data;
		const expirationDate =
			expirationTime === 'never'
				? null
				: new Date(
						Date.now() + Number(expirationTime) * 60 * 60 * 1000
					).toISOString();

		setUploadState((prev) => ({ ...prev, state: 'uploading', progress: 0 }));

		try {
			const keyFile = nanoid(8);
			const presignData = await getPresignedUrl(keyFile, file.type);

			// Upload file with progress tracking
			await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const progress = Math.round((event.loaded / event.total) * 100);
						setUploadState((prev) => ({ ...prev, progress }));
					}
				};
				xhr.onload = () =>
					xhr.status === 200
						? resolve(true)
						: reject(new Error('File upload failed'));
				xhr.onerror = () => reject(new Error('File upload error'));
				xhr.open('PUT', presignData.presignedUrl);
				xhr.send(file);
			});

			const { link } = await notifyUploadComplete({
				fileName: file.name,
				keyFile: presignData.keyFile,
				description: description || null,
				expirationDate,
				oneTimeDownload: oneTimeDownload || false,
				mimeType: file.type,
				size: file.size
			});

			const fileInfo: FileInfo = {
				fileName: file.name,
				size: file.size,
				description: description || null,
				expirationDate,
				oneTimeDownload: oneTimeDownload || false
			};

			setUploadState({
				state: 'complete',
				progress: 100,
				generatedLink: link,
				fileInfo
			});

			return presignData.keyFile;
		} catch (error) {
			console.error(error);
			setUploadState(initialState);
			throw error;
		}
	};

	const reset = () => {
		setUploadState(initialState);
	};

	return {
		...uploadState,
		handleUpload,
		reset
	};
}
