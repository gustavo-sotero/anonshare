'use client';

import { DownloadButton } from '@/components/DownloadButton';
import { FileInfo } from '@/components/FileInfo';
import { ReportDialog } from '@/components/ReportDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FileInfoData {
  name: string;
  size: number;
  expirationTime: string | null;
  oneTimeDownload: boolean;
  description: string | null;
}

export default function DownloadPage() {
  const params = useParams();
  const [fileInfo, setFileInfo] = useState<FileInfoData | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          name: data.fileName,
          size: data.size,
          expirationTime: data.expirationDate,
          oneTimeDownload: data.oneTimeDownload,
          description: data.description
        };
        setFileInfo(fileData);

        if (
          fileData.expirationTime &&
          new Date(fileData.expirationTime) < new Date()
        ) {
          setIsExpired(true);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(
          errorMessage ||
            'Erro ao carregar informações do arquivo. Por favor, tente novamente mais tarde.'
        );
      }
    };

    fetchFileInfo();
  }, [params.keyFile]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert
            variant="destructive"
            className="border-red-500 bg-red-950/50 text-red-400"
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">Erro</AlertTitle>
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-blue-400 hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-4"
        >
          <Alert
            variant="destructive"
            className="border-red-500 bg-red-950/50 text-red-400"
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">Link Expirado</AlertTitle>
            <AlertDescription className="text-red-400">
              Este link de download não está mais disponível.
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Link
              href="/"
              className="text-blue-400 hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Carregando informações do arquivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">AnonShare</h1>
          <p className="text-zinc-400">Download seguro e anônimo</p>
        </div>

        <div className="bg-black border border-zinc-800 p-6 rounded-lg space-y-4">
          <FileInfo
            name={fileInfo.name}
            size={fileInfo.size}
            expirationTime={fileInfo.expirationTime}
            oneTimeDownload={fileInfo.oneTimeDownload}
            description={fileInfo.description}
          />
          <DownloadButton
            fileId={params.keyFile as string}
            fileName={fileInfo.name}
            oneTimeDownload={fileInfo.oneTimeDownload}
            onDownloadComplete={() => {
              console.log('Download completo');
            }}
          />
          <ReportDialog />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-400 hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
