import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { put } from "@vercel/blob"

const MAX_SIZE = 100 * 1024 * 1024 // 100 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 })
  }

  const allowedTypes = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm",
  ]

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Solo imágenes (jpg, png, webp) y videos (mp4, mov, avi, webm)." },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "El archivo no puede superar 100 MB." },
      { status: 400 }
    )
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const blobName = `pruebas-trabajo/${session.user.id}/${Date.now()}-${safeName}`

  const blob = await put(blobName, file, {
    access: "public",
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url, name: file.name, type: file.type })
}
