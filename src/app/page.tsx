'use client';

import { FileUploadForm } from '@/components/FileUploadForm';
import { Footer } from '@/components/Footer';
import { UploadComplete } from '@/components/UploadComplete';
import { UploadProgress } from '@/components/UploadProgress';
import { AnimatePresence, motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export default function Home() {
  // const router = useRouter();

  const [uploadState, setUploadState] = useState<
    'initial' | 'uploading' | 'complete'
  >('initial');
  const [generatedLink, setGeneratedLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState<{
    file: File | null;
    expirationTime: string | null;
    oneTimeDownload: boolean;
  }>({
    file: null,
    expirationTime: null,
    oneTimeDownload: false
  });

  const handleSubmit = async (data: {
    expirationTime?: string;
    oneTimeDownload?: boolean;
    file?: File;
    description?: string;
  }) => {
    const file = data.file;
    const expirationTime =
      data?.expirationTime === 'never'
        ? null
        : new Date().setHours(
            new Date().getHours() + Number(data?.expirationTime)
          );
    const oneTimeDownload = data.oneTimeDownload;
    const description = data.description;
    if (!file) {
      console.error('No file provided');
      return;
    }

    setFileData({
      file,
      expirationTime: expirationTime
        ? new Date(expirationTime).toISOString()
        : null,
      oneTimeDownload: oneTimeDownload || false
    });

    setUploadState('uploading');
    setProgress(0);
    try {
      const keyFile = nanoid(8);
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyFile, contentType: file.type })
      });
      if (!presignRes.ok) throw new Error('Failed to get presigned data');
      const presignData = await presignRes.json();
      console.log('Presign data:', presignData);

      // Upload file using XMLHttpRequest to track progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round(
              (event.loaded / event.total) * 100
            );
            setProgress(percentCompleted);
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(new Error('File upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('File upload error'));
        xhr.open('PUT', presignData.presignedUrl);
        xhr.send(file);
      });

      // Notify backend that the upload is complete
      const notifyRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          keyFile: presignData.keyFile,
          description: description || null,
          expirationDate: expirationTime,
          oneTimeDownload: oneTimeDownload || false,
          mimeType: file.type,
          size: file.size
        })
      });
      if (!notifyRes.ok) throw new Error('Failed to notify upload');
      const notifyData = await notifyRes.json();

      setGeneratedLink(notifyData.link);
      setUploadState('complete');
      // router.push('/share/' + presignData.keyFile);
    } catch (error) {
      console.error(error);
      setUploadState('initial');
    }
  };

  const handleNewUpload = () => {
    setUploadState('initial');
    setFileData({
      file: null,
      expirationTime: null,
      oneTimeDownload: false
    });
  };

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold">AnonShare</h1>
            <p className="text-gray-400">
              Compartilhamento anônimo de arquivos. Faça upload, compartilhe e
              acompanhe seus arquivos.
            </p>
          </div>

          <div className="bg-black border border-zinc-800 p-6 rounded-lg space-y-6">
            <AnimatePresence mode="wait">
              {uploadState === 'initial' && (
                <motion.div key="initial" {...fadeInOut}>
                  <div className="space-y-2">
                    <h2 className="text-xl">Upload de Arquivo</h2>
                    <p className="text-sm text-gray-400">
                      Arraste e solte seu arquivo ou clique para procurar
                    </p>
                  </div>
                  {/* FileUploadForm should call onSubmit with the selected File object */}
                  <FileUploadForm onSubmit={handleSubmit} />
                </motion.div>
              )}

              {uploadState === 'uploading' && (
                <motion.div key="uploading" {...fadeInOut}>
                  <UploadProgress progress={progress} />
                </motion.div>
              )}

              {uploadState === 'complete' && (
                <motion.div key="complete" {...fadeInOut}>
                  <UploadComplete
                    generatedLink={generatedLink}
                    onNewUpload={handleNewUpload}
                    fileInfo={{
                      fileName: fileData.file?.name || '',
                      size: fileData.file?.size || 0,
                      expirationDate: fileData.expirationTime,
                      oneTimeDownload: fileData.oneTimeDownload
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
