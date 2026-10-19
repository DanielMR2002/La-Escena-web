import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { requireArtist } from "@/lib/auth"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireArtist()
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/heif",
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Photo blob upload completed:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
