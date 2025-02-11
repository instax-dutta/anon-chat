import { S3Client } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  endpoint: "https://minio.sdad.pro",
  region: "auto",
  credentials: {
    accessKeyId: "AkAm5KCgXJVDcVWcEWa1",
    secretAccessKey: "JHUardlVQcBVXnEwmY0fnd5SjKFvTxcauFqNmLQu",
  },
  forcePathStyle: true,
})

export { s3Client }

