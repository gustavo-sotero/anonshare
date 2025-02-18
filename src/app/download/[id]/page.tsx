"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, Clock, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileInfo {
  name: string
  size: number
  expirationTime: string | null
  oneTimeDownload: boolean
  description: string | null
}

export default function DownloadPage() {
  const params = useParams()
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadCount, setDownloadCount] = useState(0)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Simular a busca das informações do arquivo
    const fetchFileInfo = async () => {
      // Aqui você faria uma chamada à API para obter as informações reais do arquivo
      const mockFileInfo: FileInfo = {
        name: "exemplo.pdf",
        size: 1024 * 1024 * 5, // 5 MB
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas a partir de agora
        oneTimeDownload: false, // Alterado para false para demonstrar a funcionalidade de múltiplos downloads
        description: "Este é um arquivo de exemplo para demonstração.",
      }
      setFileInfo(mockFileInfo)

      // Verificar se o link expirou
      if (mockFileInfo.expirationTime && new Date(mockFileInfo.expirationTime) < new Date()) {
        setIsExpired(true)
      }
    }

    fetchFileInfo()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simular um pequeno atraso antes de iniciar o download
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Iniciar o download pelo navegador
    const link = document.createElement("a")
    link.href = `/api/download/${params.id}` // Substitua por sua URL de download real
    link.download = fileInfo?.name || "download"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsDownloading(false)
    setDownloadCount(downloadCount + 1)

    if (!fileInfo?.oneTimeDownload) {
      setCountdown(30) // Definir contagem regressiva de 30 segundos para próximo download
    }
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-bold">Link Expirado</h1>
          <p>Este link de download não está mais disponível.</p>
          <Link href="/" className="text-blue-400 hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </motion.div>
      </div>
    )
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Carregando informações do arquivo...</p>
        </div>
      </div>
    )
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

        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">{fileInfo.name}</h2>
          <p className="text-sm text-zinc-400">Tamanho: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB</p>

          {fileInfo.description && (
            <p className="text-sm text-zinc-300 border-t border-zinc-800 pt-4">{fileInfo.description}</p>
          )}

          {fileInfo.expirationTime && (
            <div className="flex items-center text-sm text-zinc-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>Expira em: {new Date(fileInfo.expirationTime).toLocaleString()}</span>
            </div>
          )}

          {fileInfo.oneTimeDownload && (
            <div className="text-sm text-yellow-500">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Este link permite apenas um download
            </div>
          )}

          <Button
            onClick={handleDownload}
            className="w-full"
            disabled={isDownloading || (fileInfo.oneTimeDownload && downloadCount > 0) || countdown > 0}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando download...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Baixar Arquivo
              </>
            )}
          </Button>

          {!fileInfo.oneTimeDownload && downloadCount > 0 && countdown > 0 && (
            <p className="text-sm text-zinc-400 text-center">Próximo download disponível em {countdown} segundos</p>
          )}

          {fileInfo.oneTimeDownload && downloadCount > 0 && (
            <p className="text-sm text-zinc-400 text-center">Este arquivo já foi baixado e não está mais disponível.</p>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-400 hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

