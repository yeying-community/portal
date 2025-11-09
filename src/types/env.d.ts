// TypeScript 不认识 import.meta.env
// 为 import.meta.env 添加类型声明
interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string
  readonly VITE_MINIO_ENDPOINT: string
  readonly VITE_MINIO_ACCESS_KEY: string
  readonly VITE_MINIO_SECRET_KEY: string
  readonly VITE_MINIO_BUCKET: string
  readonly VITE_MINIO_USE_SSL: string
  readonly VITE_MINIO_AVATAR: string
  readonly VITE_MINIO_HTTP_PROTOCOL: string
  readonly VITE_MINIO_PORT: string
  readonly VITE_APPLICANT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}