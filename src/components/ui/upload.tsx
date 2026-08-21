import * as React from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  FileTextIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from "@/lib/icons"
import { cn } from "@/lib/utils"

type UploadVariant = "button" | "dropzone" | "picture-card" | "link"
type UploadListType = "text" | "picture"
type UploadImageSize = "small" | "mini" | "micro"
type UploadFileStatus = "idle" | "uploading" | "success" | "error"

type UploadFileItem = {
  id: string
  name: string
  size: number
  type?: string
  status?: UploadFileStatus
  percent?: number
  url?: string
  error?: string
  file?: File
}

type UploadRejectedFile = {
  file: File
  reason: "accept" | "max-size" | "max-count"
}

type UploadProps = Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> & {
  value?: UploadFileItem[]
  defaultValue?: UploadFileItem[]
  onValueChange?: (files: UploadFileItem[]) => void
  onFilesSelect?: (files: File[], items: UploadFileItem[]) => void
  onReject?: (files: UploadRejectedFile[]) => void
  onRemove?: (file: UploadFileItem) => boolean | void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxCount?: number
  maxSize?: number
  variant?: UploadVariant
  listType?: UploadListType
  imageSize?: UploadImageSize
  showFileList?: boolean
  label?: string
  helperText?: string
  browseLabel?: string
}

const imageSizeClassName: Record<UploadImageSize, string> = {
  small: "size-17",
  mini: "size-9",
  micro: "size-7",
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(",").map((part) => part.trim().toLowerCase()).some((part) => {
    if (!part) return false
    if (part.startsWith(".")) return file.name.toLowerCase().endsWith(part)
    if (part.endsWith("/*")) return file.type.toLowerCase().startsWith(part.slice(0, -1))
    return file.type.toLowerCase() === part
  })
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / 1024 / 1024).toFixed(size < 10 * 1024 * 1024 ? 1 : 0)} MB`
}

function Upload({
  className,
  value,
  defaultValue = [],
  onValueChange,
  onFilesSelect,
  onReject,
  onRemove,
  accept,
  multiple = false,
  disabled = false,
  maxCount,
  maxSize,
  variant = "button",
  listType = "text",
  imageSize = "small",
  showFileList = true,
  label,
  helperText,
  browseLabel = "点击上传",
  ...props
}: UploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [dragging, setDragging] = React.useState(false)
  const files = value ?? uncontrolledValue
  const inputId = React.useId()
  const atLimit = maxCount !== undefined && files.length >= maxCount

  const commit = React.useCallback((next: UploadFileItem[]) => {
    if (value === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }, [onValueChange, value])

  const addFiles = React.useCallback((selected: File[]) => {
    if (disabled || selected.length === 0) return
    const available = maxCount === undefined ? selected.length : Math.max(0, maxCount - files.length)
    const rejected: UploadRejectedFile[] = []
    const accepted: File[] = []

    selected.forEach((file, index) => {
      if (index >= available) rejected.push({ file, reason: "max-count" })
      else if (!matchesAccept(file, accept)) rejected.push({ file, reason: "accept" })
      else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: "max-size" })
      else accepted.push(file)
    })

    const items = accepted.map((file, index): UploadFileItem => ({
      id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "idle",
      file,
    }))
    if (items.length > 0) {
      commit([...files, ...items])
      onFilesSelect?.(accepted, items)
    }
    if (rejected.length > 0) onReject?.(rejected)
  }, [accept, commit, disabled, files, maxCount, maxSize, onFilesSelect, onReject])

  const openPicker = () => {
    if (!disabled && !atLimit) inputRef.current?.click()
  }

  const removeFile = (file: UploadFileItem) => {
    if (disabled || onRemove?.(file) === false) return
    commit(files.filter((item) => item.id !== file.id))
  }

  const renderTrigger = () => {
    const triggerLabel = label ?? (variant === "link" ? "+ 添加附件" : "选择文件")
    if (variant === "dropzone") {
      return (
        <div
          role="button"
          tabIndex={disabled || atLimit ? -1 : 0}
          aria-controls={inputId}
          aria-disabled={disabled || atLimit || undefined}
          data-slot="upload-dropzone"
          data-dragging={dragging ? "true" : undefined}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              openPicker()
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            if (!disabled && !atLimit) setDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            addFiles(Array.from(event.dataTransfer.files))
          }}
          className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-surface text-body text-foreground outline-none transition-colors hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring data-[dragging=true]:border-primary data-[dragging=true]:bg-muted aria-disabled:cursor-not-allowed aria-disabled:border-border-subtle aria-disabled:bg-surface-disabled aria-disabled:text-foreground-disabled"
        >
          <UploadIcon aria-hidden="true" className="size-12 text-foreground-disabled" />
          <span>{label ?? "将文件拖到此处，或"} <span className="text-primary">{browseLabel}</span></span>
        </div>
      )
    }
    if (variant === "picture-card") {
      if (atLimit) return null
      return (
        <button
          type="button"
          aria-controls={inputId}
          disabled={disabled}
          data-slot="upload-picture-trigger"
          onClick={openPicker}
          className={cn("flex shrink-0 items-center justify-center rounded-lg border border-dashed border-input bg-muted text-foreground outline-none transition-colors hover:border-primary hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-disabled disabled:text-foreground-disabled", imageSizeClassName[imageSize])}
        >
          <PlusIcon aria-hidden="true" />
          <span className="sr-only">{triggerLabel}</span>
        </button>
      )
    }
    return (
      <Button
        type="button"
        variant={variant === "link" ? "plain" : "default"}
        tone={variant === "link" ? "info" : "default"}
        disabled={disabled || atLimit}
        onClick={openPicker}
        data-slot="upload-trigger"
      >
        {variant === "button" && <UploadIcon data-icon="inline-start" />}
        {triggerLabel}
      </Button>
    )
  }

  return (
    <div
      {...props}
      data-component="Upload"
      data-slot="upload"
      data-variant={variant}
      data-list-type={listType}
      data-disabled={disabled ? "true" : undefined}
      data-dragging={dragging ? "true" : undefined}
      className={cn("flex w-full min-w-0 flex-col items-start gap-2", className)}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || atLimit}
        data-slot="upload-input"
        className="sr-only"
        onChange={(event) => {
          addFiles(Array.from(event.currentTarget.files ?? []))
          event.currentTarget.value = ""
        }}
      />
      {variant === "picture-card" ? (
        <div data-slot="upload-picture-grid" className="flex flex-wrap items-start gap-2">
          {showFileList && files.map((file) => (
            <UploadPictureItem key={file.id} file={file} size={imageSize} disabled={disabled} onRemove={() => removeFile(file)} />
          ))}
          {renderTrigger()}
        </div>
      ) : (
        <>
          {renderTrigger()}
          {helperText && <p data-slot="upload-helper" className="text-caption text-muted-foreground">{helperText}</p>}
          {showFileList && files.length > 0 && (
            <UploadList files={files} type={listType} disabled={disabled} onRemove={removeFile} />
          )}
        </>
      )}
    </div>
  )
}

function UploadPictureItem({ file, size, disabled, onRemove }: { file: UploadFileItem; size: UploadImageSize; disabled: boolean; onRemove: () => void }) {
  return (
    <div data-slot="upload-picture-item" data-status={file.status ?? "idle"} className={cn("group/upload-picture relative overflow-hidden rounded-lg border border-input bg-surface", imageSizeClassName[size])}>
      {file.url ? <img src={file.url} alt={file.name} className="size-full object-cover" /> : <FileTextIcon aria-hidden="true" className="absolute inset-1/2 size-5 -translate-1/2 text-muted-foreground" />}
      {file.status === "uploading" && <div className="absolute inset-0 flex items-center justify-center bg-overlay text-primary-foreground"><Loader2Icon aria-label="上传中" className="animate-spin" /></div>}
      {file.status === "success" && <CheckCircleIcon aria-label="上传成功" className="absolute top-1 right-1 size-4 text-success" />}
      {file.status === "error" && <AlertCircleIcon aria-label="上传失败" className="absolute inset-1/2 size-5 -translate-1/2 text-destructive" />}
      {!disabled && file.status !== "uploading" && (
        <button type="button" onClick={onRemove} aria-label={`删除 ${file.name}`} className="absolute inset-0 hidden items-center justify-center bg-overlay text-primary-foreground group-hover/upload-picture:flex focus-visible:flex">
          <Trash2Icon aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function UploadList({ files, type, disabled, onRemove }: { files: UploadFileItem[]; type: UploadListType; disabled: boolean; onRemove: (file: UploadFileItem) => void }) {
  return (
    <ul data-slot="upload-list" className="flex w-full flex-col gap-2" aria-label="文件列表">
      {files.map((file) => (
        <li key={file.id} data-slot="upload-item" data-status={file.status ?? "idle"} className={cn("relative min-w-0", type === "picture" ? "flex min-h-21 items-center gap-2 rounded-lg border border-input bg-surface p-2" : "grid min-h-7 grid-cols-[minmax(0,1fr)_5rem_auto] items-center gap-2 rounded-md px-1 text-caption hover:bg-muted", file.status === "error" && "border-destructive text-destructive")}>
          {type === "picture" && <div className="size-17 shrink-0 overflow-hidden rounded-md border border-border-subtle bg-muted">{file.url ? <img src={file.url} alt="" className="size-full object-cover" /> : <FileTextIcon aria-hidden="true" className="m-auto size-5 h-full text-muted-foreground" />}</div>}
          <div className="flex min-w-0 flex-col gap-1">
            <span className={cn("truncate", file.status === "error" ? "text-destructive" : "text-info")}>{file.name}</span>
            {file.status === "uploading" && <Progress value={file.percent ?? 0} aria-label={`${file.name} 上传进度`} />}
            {file.error && <span className="text-caption text-destructive">{file.error}</span>}
          </div>
          <span className="text-foreground">{file.status === "uploading" ? `${file.percent ?? 0}%` : formatFileSize(file.size)}</span>
          <Button type="button" variant="plain" tone={file.status === "error" ? "danger" : "info"} size="xs" disabled={disabled} onClick={() => onRemove(file)} aria-label={`删除 ${file.name}`}>
            {type === "picture" ? <Trash2Icon aria-hidden="true" /> : "删除"}
          </Button>
        </li>
      ))}
    </ul>
  )
}

export { Upload }
export type { UploadFileItem, UploadFileStatus, UploadImageSize, UploadListType, UploadProps, UploadRejectedFile, UploadVariant }
