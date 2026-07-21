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
        </dl>
      )}
    </div>
  )
}
