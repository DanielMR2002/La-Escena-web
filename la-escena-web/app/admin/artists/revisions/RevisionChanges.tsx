"use client"

import { useState } from "react"

const FIELDS: { key: string; label: string; suffix?: string }[] = [
  { key: "name",        label: "Nombre" },
  { key: "city",        label: "Ciudad" },
  { key: "category",    label: "Categoría" },
  { key: "experience",  label: "Experiencia", suffix: " años" },
  { key: "projectTypes", label: "Tipo de proyectos" },
  { key: "experienceDescription", label: "Experiencia (descripción)" },
  { key: "featuredProjects", label: "Proyectos destacados" },
  { key: "age",         label: "Edad", suffix: " años" },
  { key: "height",      label: "Estatura", suffix: " cm" },
  { key: "cvUrl",       label: "CV" },
  { key: "description", label: "Descripción" },
  { key: "complexion",   label: "Complexión" },
  { key: "eyeColor",     label: "Color de ojos" },
  { key: "hairType",     label: "Tipo de cabello" },
  { key: "hairLength",   label: "Largo del cabello" },
  { key: "hairColor",    label: "Color de cabello" },
  { key: "agencyProfile", label: "Perfil en la agencia" },
]

export default function RevisionChanges({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(false)

  const hashtags = Array.isArray(data?.hashtags) && data.hashtags.length > 0
    ? data.hashtags.join(", ")
    : null

  const skills = Array.isArray(data?.skills) && data.skills.length > 0
    ? data.skills.join(", ")
    : null

  const trayectoria = Array.isArray(data?.trayectoria) ? data.trayectoria : []

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-medium text-zinc-500 hover:text-zinc-700 underline transition-colors"
      >
        {open ? "Ocultar cambios" : "Ver cambios"}
      </button>

      {open && (
        <dl className="mt-3 space-y-3 border-t border-zinc-100 pt-3">
          {FIELDS.map(({ key, label, suffix }) => {
            const value = data?.[key]
            if (value === undefined || value === null || value === "") return null
            return (
              <div key={key}>
                <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</dt>
                <dd className="text-sm text-zinc-700 mt-0.5">{String(value)}{suffix ?? ""}</dd>
              </div>
            )
          })}

          {hashtags && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Hashtags</dt>
              <dd className="text-sm text-zinc-700 mt-0.5">{hashtags}</dd>
            </div>
          )}

          {skills && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Habilidades</dt>
              <dd className="text-sm text-zinc-700 mt-0.5">{skills}</dd>
            </div>
          )}

          {data?.hasPendingMedia && (
            <div>
              <dd className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 inline-block">
                📷 Tiene fotos y/o videos pendientes de aprobación
              </dd>
            </div>
          )}

          {trayectoria.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Trayectoria</dt>
              <dd className="space-y-1">
                {trayectoria.map((t: any, i: number) => (
                  <div key={i} className="text-sm bg-zinc-50 rounded px-2 py-1">
                    <span className="font-medium">{t.proyecto}</span>
                    {t.cliente && <span className="text-zinc-500"> · {t.cliente}</span>}
                    {t.anio && <span className="text-zinc-400 text-xs"> · {t.anio}</span>}
                  </div>
                ))}
              </dd>
            </div>
          )}

          {Array.isArray(data?.deletePruebaKeys) && data.deletePruebaKeys.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">🗑 Solicita eliminar pruebas de trabajo</dt>
              <dd className="space-y-1">
                {data.deletePruebaKeys.map((key: string) => (
                  <div key={key} className="text-sm bg-red-50 border border-red-200 rounded px-2 py-1 font-mono text-red-700">
                    key: {key}
                  </div>
                ))}
              </dd>
            </div>
          )}

          {Array.isArray(data?.pruebasTrabajo) && data.pruebasTrabajo.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">📹 Nuevas pruebas de trabajo</dt>
              <dd className="grid grid-cols-2 gap-2">
                {data.pruebasTrabajo.map((p: any, i: number) => {
                  const isCFVideo = p.fileType?.startsWith("video") && p.url?.includes("cloudflarestream.com")
                  const cfUid = isCFVideo ? p.url?.split("/").pop() : null
                  return (
                    <a key={p._key ?? i} href={p.url} target="_blank" rel="noopener noreferrer"
                      className="block rounded overflow-hidden border border-zinc-200 bg-zinc-50">
                      <div className="aspect-video relative bg-zinc-200">
                        {isCFVideo ? (
                          <img src={`https://videodelivery.net/${cfUid}/thumbnails/thumbnail.jpg?time=2s&height=160`}
                            alt={p.title ?? "Video"} className="w-full h-full object-cover" />
                        ) : p.fileType?.startsWith("image") ? (
                          <img src={p.url} alt={p.title ?? "Imagen"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">▶</div>
                        )}
                      </div>
                      {p.title && <p className="text-[10px] text-zinc-500 truncate px-1 py-0.5">{p.title}</p>}
                    </a>
                  )
                })}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
