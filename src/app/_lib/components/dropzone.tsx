'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface DragDropFilesProps {
  files: File | null
  setFiles: React.Dispatch<React.SetStateAction<File | null>>
}

export default function Dropzone({ files, setFiles }: DragDropFilesProps) {
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles[0] || null)
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles[0] || null)
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [files])


  return (
    <div className="max-w-md space-y-5">
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={onFileInputChange}
          ref={inputRef}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">
            Перетащите файл сюда или нажмите, чтобы выбрать файл
          </p>
        </label>
      </div>

      {files && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-1">Выбранный файл:</h3>
          <ul className="space-y-1">
            <li className="flex items-center justify-between bg-card p-1 rounded text-sm">
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2 text-gray-500" />
                <span className="truncate max-w-[180px]">{files.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(files)}
                aria-label={`Remove ${files.name}`}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

