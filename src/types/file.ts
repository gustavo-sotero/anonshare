export interface FileInfo {
	fileName: string;
	size: number;
	description: string | null;
	expirationDate: string | null;
	oneTimeDownload: boolean;
	isOnceDownloaded?: boolean;
	isDisabled?: boolean;
	disabledReason?: string | null;
}

export interface UploadFormData {
	file: File;
	expirationTime?: string;
	oneTimeDownload?: boolean;
	description?: string;
}

export interface PresignedData {
	presignedUrl: string;
	keyFile: string;
}

export interface UploadState {
	state: 'initial' | 'uploading' | 'complete';
	progress: number;
	generatedLink: string;
	fileInfo: FileInfo | null;
}
