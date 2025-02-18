'use client';

import { Footer } from '@/components/Footer';
import { UploadComplete } from '@/components/UploadComplete';
import { AnimatePresence, motion } from 'framer-motion';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FileInfoData {
  fileName: string;
  size: number;
  expirationTime: string | null;
  oneTimeDownload: boolean;
  description: string | null;
}

export default function SharePage() {
  const params = useParams();
  const [fileInfo, setFileInfo] = useState<FileInfoData | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>('');

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };
  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await fetch(`/api/file/${params.keyFile}`);
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message);
        }
        const data = await response.json();
        // Map API response to FileInfoData
        const fileData: FileInfoData = {
          fileName: data.fileName,
          size: data.size,
          expirationTime: data.expirationDate,
          oneTimeDownload: data.oneTimeDownload,
          description: data.description
        };
        setGeneratedLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/download/${params.keyFile}`
        );
        setFileInfo(fileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log(errorMessage);
      }
    };
    fetchFileInfo();
  }, [params.keyFile]);

  function handleNewUpload() {
    redirect('/');
  }

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
              {fileInfo && (
                <motion.div key="complete" {...fadeInOut}>
                  <UploadComplete
                    generatedLink={generatedLink}
                    onNewUpload={handleNewUpload}
                    fileInfo={{
                      fileName: fileInfo.fileName,
                      size: fileInfo.size,
                      expirationDate: fileInfo.expirationTime,
                      oneTimeDownload: fileInfo.oneTimeDownload
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
