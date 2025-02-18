import { Clock, AlertTriangle } from "lucide-react"

interface FileInfoProps {
  name: string
  size: number
  expirationTime: string | null
  oneTimeDownload: boolean
  description: string | null
}

export function FileInfo({ name, size, expirationTime, oneTimeDownload, description }: FileInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-sm text-zinc-400">Tamanho: {(size / (1024 * 1024)).toFixed(2)} MB</p>

      {description && <p className="text-sm text-zinc-300 border-t border-zinc-800 pt-4">{description}</p>}

      {expirationTime && (
        <div className="flex items-center text-sm text-zinc-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>Expira em: {new Date(expirationTime).toLocaleString()}</span>
        </div>
      )}

      {oneTimeDownload && (
        <div className="text-sm text-yellow-500">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Este link permite apenas um download
        </div>
      )}
    </div>
  )
}

