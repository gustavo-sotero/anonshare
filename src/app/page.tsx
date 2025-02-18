'use client';

import { FileUploadForm } from '@/components/FileUploadForm';
import { Footer } from '@/components/Footer';
import { UploadComplete } from '@/components/UploadComplete';
import { UploadProgress } from '@/components/UploadProgress';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [uploadState, setUploadState] = useState<
    'initial' | 'uploading' | 'complete'
  >('initial');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleSubmit = async () => {
    setUploadState('uploading');
    // Simular o processo de upload
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // Gerar um link falso para demonstração
    const fakeLink = `https://anonshare.com/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setGeneratedLink(fakeLink);
    setUploadState('complete');
  };

  const handleNewUpload = () => {
    setUploadState('initial');
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

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-6">
            <AnimatePresence mode="wait">
              {uploadState === 'initial' && (
                <motion.div key="initial" {...fadeInOut}>
                  <div className="space-y-2">
                    <h2 className="text-xl">Upload de Arquivo</h2>
                    <p className="text-sm text-gray-400">
                      Arraste e solte seu arquivo ou clique para procurar
                    </p>
                  </div>
                  <FileUploadForm onSubmit={handleSubmit} />
                </motion.div>
              )}

              {uploadState === 'uploading' && (
                <motion.div key="uploading" {...fadeInOut}>
                  <UploadProgress />
                </motion.div>
              )}

              {uploadState === 'complete' && (
                <motion.div key="complete" {...fadeInOut}>
                  <UploadComplete
                    generatedLink={generatedLink}
                    onNewUpload={handleNewUpload}
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
