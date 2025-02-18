"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

const schema = z.object({
  file: z
    .any()
    .refine((file) => file, "Arquivo é obrigatório")
    .refine((file) => file && file.size <= MAX_FILE_SIZE, `O tamanho do arquivo deve ser menor que 100MB.`),
  expirationTime: z.string().min(1, "Por favor, selecione um tempo de expiração"),
  oneTimeDownload: z.boolean().default(false),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface FileUploadFormProps {
  onSubmit: (data: FormData) => void
}

export function FileUploadForm({ onSubmit }: FileUploadFormProps) {
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oneTimeDownload: false,
      expirationTime: "never",
    },
  })

  const watchFile = watch("file")

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.size <= MAX_FILE_SIZE) {
      setValue("file", file, { shouldValidate: true })
      setFileSizeError(null)
    } else {
      setFileSizeError("O arquivo selecionado é muito grande. O tamanho máximo permitido é 100MB.")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  })

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const toggleAdvancedOptions = () => setIsAdvancedOpen(!isAdvancedOpen)

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center transition-colors",
          "hover:border-zinc-700 cursor-pointer",
          isDragActive && "border-zinc-700 bg-zinc-900/50",
          errors.file && "border-red-500",
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            {watchFile ? (
              <p>Arquivo selecionado: {watchFile.name}</p>
            ) : (
              <p>Solte seu arquivo aqui ou clique para procurar</p>
            )}
          </div>
          <p className="text-xs text-gray-500">Tamanho máximo do arquivo: 100MB</p>
        </div>
      </div>

      {(errors.file || fileSizeError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errors.file?.message || fileSizeError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
          onClick={toggleAdvancedOptions}
        >
          Opções Avançadas
          {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        <AnimatePresence initial={false}>
          {isAdvancedOpen && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="expirationTime">Tempo de Expiração</Label>
                  <Select onValueChange={(value) => setValue("expirationTime", value)} defaultValue="never">
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Selecione o tempo de expiração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca</SelectItem>
                      <SelectItem value="1">1 Hora</SelectItem>
                      <SelectItem value="24">24 Horas</SelectItem>
                      <SelectItem value="72">3 Dias</SelectItem>
                      <SelectItem value="168">7 Dias</SelectItem>
                      <SelectItem value="720">30 Dias</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-400">
                    Escolha quando o link do arquivo irá expirar (ou nunca, se não selecionado)
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800">
                  <div className="space-y-1">
                    <Label htmlFor="oneTimeDownload">Download Único</Label>
                    <p className="text-sm text-gray-400">O link expirará após o primeiro download</p>
                  </div>
                  <Switch
                    id="oneTimeDownload"
                    checked={watch("oneTimeDownload")}
                    onCheckedChange={(checked) => setValue("oneTimeDownload", checked)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (Opcional)</Label>
        <Textarea
          {...register("description")}
          placeholder="Adicione uma descrição para este arquivo..."
          className="bg-zinc-800 border-zinc-700 min-h-[100px] resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-gray-200"
        disabled={!watchFile || !!errors.file}
      >
        Fazer Upload
      </Button>
    </motion.form>
  )
}

