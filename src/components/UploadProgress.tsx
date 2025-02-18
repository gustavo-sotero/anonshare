"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export function UploadProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 10
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Progress value={progress} className="w-full" />
      <p className="text-center">Fazendo upload do arquivo... {progress}%</p>
    </motion.div>
  )
}

