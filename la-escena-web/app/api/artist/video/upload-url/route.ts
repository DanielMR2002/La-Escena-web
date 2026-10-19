import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: HandleUploadBody
  try {
    body = (await req.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const ext = pathname.split(".").pop()?.toLowerCase() ?? ""
        const allowedExts = ["mp4", "mov", "avi", "webm"]
        if (!allowedExts.includes(ext)) {
          throw new Error("Tipo de archivo no permitido. Solo se aceptan videos.")
        }
        return {
          allowedContentTypes: [
            "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm",
          ],
          maximumSizeInBytes: 500 * 1024 * 1024,
          tokenPayload: JSON.stringify({ userId: session.user.id }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        try {
          console.log("Video subido:", blob.url)
        } catch {
          // Ignore
        }
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Video upload-url error:", error)
    return NextResponse.json(
      { error: (error as Error).message ?? "Error generando token de subida" },
      { status: 400 }
    )
  }
}
