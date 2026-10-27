"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useRef } from "react"

interface Props {
  content: any[]
  onChange: (blocks: any[]) => void
  placeholder?: string
}

function blocksToHtml(blocks: any[]): string {
  if (!blocks?.length) return ""
  const items: string[] = []
  let bulletBuffer: string[] = []

  const flushBullets = () => {
    if (bulletBuffer.length) {
      items.push(`<ul>${bulletBuffer.join("")}</ul>`)
      bulletBuffer = []
    }
  }

  for (const b of blocks) {
    if (b._type !== "block") continue
    const text = b.children?.map((c: any) => {
      let t = c.text || ""
      if (c.marks?.includes("strong")) t = `<strong>${t}</strong>`
      if (c.marks?.includes("em")) t = `<em>${t}</em>`
      return t
    }).join("") ?? ""

    if (b.listItem === "bullet") {
      bulletBuffer.push(`<li>${text}</li>`)
    } else {
      flushBullets()
      if (b.style === "h2") items.push(`<h2>${text}</h2>`)
      else if (b.style === "h3") items.push(`<h3>${text}</h3>`)
      else items.push(`<p>${text || "<br>"}</p>`)
    }
  }
  flushBullets()
  return items.join("")
}

function tiptapToBlocks(json: any): any[] {
  const blocks: any[] = []
  const key = () => Math.random().toString(36).slice(2, 10)

  for (const node of json.content ?? []) {
    if (node.type === "bulletList") {
      for (const li of node.content ?? []) {
        const children = (li.content?.[0]?.content ?? []).map((span: any) => ({
          _type: "span", _key: key(),
          text: span.text ?? "",
          marks: [
            ...(span.marks?.some((m: any) => m.type === "bold") ? ["strong"] : []),
            ...(span.marks?.some((m: any) => m.type === "italic") ? ["em"] : []),
          ],
        }))
        if (!children.length) children.push({ _type: "span", _key: key(), text: "", marks: [] })
        blocks.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children })
      }
    } else if (node.type === "paragraph") {
      const children = (node.content ?? []).map((span: any) => ({
        _type: "span", _key: key(),
        text: span.text ?? "",
        marks: [
          ...(span.marks?.some((m: any) => m.type === "bold") ? ["strong"] : []),
          ...(span.marks?.some((m: any) => m.type === "italic") ? ["em"] : []),
        ],
      }))
      if (!children.length) children.push({ _type: "span", _key: key(), text: "", marks: [] })
      blocks.push({ _type: "block", _key: key(), style: "normal", markDefs: [], children })
    } else if (node.type === "heading") {
      const level = node.attrs?.level ?? 2
      const children = (node.content ?? []).map((span: any) => ({
        _type: "span", _key: key(), text: span.text ?? "", marks: [],
      }))
      blocks.push({ _type: "block", _key: key(), style: `h${level}`, markDefs: [], children })
    }
  }
  return blocks
}

export default function TiptapEditor({ content, onChange, placeholder }: Props) {
  const initialHtml = useRef(blocksToHtml(content))
  const initialized = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "Escribe el contenido aquí..." }),
    ],
    content: initialHtml.current,
    onUpdate({ editor }) {
      onChange(tiptapToBlocks(editor.getJSON()))
    },
    immediatelyRender: false,
  })

  // Cargar contenido existente cuando el editor esté listo (primera vez)
  useEffect(() => {
    if (!editor || initialized.current) return
    const html = initialHtml.current
    if (html) {
      editor.commands.setContent(html, false)
      initialized.current = true
    }
  }, [editor])

  if (!editor) return null

  const btn = (label: string, action: () => void, active?: boolean, style?: string) => (
    <button
      type="button"
      onClick={action}
      className={`px-2 py-1 text-xs rounded transition-colors ${style ?? ""} ${
        active ? "bg-zinc-200 text-zinc-900 font-semibold" : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-zinc-100 bg-zinc-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs rounded transition-colors font-bold ${editor.isActive("bold") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-100"}`}
        >
          N
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs rounded transition-colors italic ${editor.isActive("italic") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-100"}`}
        >
          I
        </button>
        <span className="w-px bg-zinc-200 mx-1" />
        {btn("Título", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("Subtítulo", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        <span className="w-px bg-zinc-200 mx-1" />
        {btn("• Lista", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        <span className="w-px bg-zinc-200 mx-1" />
        {btn("↩ Deshacer", () => editor.chain().focus().undo().run())}
        {btn("↪ Rehacer", () => editor.chain().focus().redo().run())}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3 py-3 min-h-[200px] text-sm text-zinc-800
          [&_.tiptap]:outline-none
          [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:my-2
          [&_.tiptap_li]:my-0.5
          [&_.tiptap_p.is-editor-empty:first-child::before]:text-zinc-400
          [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.tiptap_p.is-editor-empty:first-child::before]:float-left
          [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none
          [&_.tiptap_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}
