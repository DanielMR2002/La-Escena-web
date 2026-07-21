"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ARTIST_CATEGORIES, formatCategoryLabel } from "@/lib/artistCategories"
import {
  COMPLEXION_OPTIONS,
  EYE_COLOR_OPTIONS,
  HAIR_TYPE_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_COLOR_OPTIONS,
  SKILL_OPTIONS,
  AGENCY_PROFILE_OPTIONS,
  TIPOS_CLASE_OPTIONS,
} from "@/lib/artistProfileOptions"

type TrayectoriaItem = { proyecto: string; cliente: string; anio: string }

type ArtistData = {
  name?:               string
  city?:               string
  category?:           string
  experience?:         string | number
  projectTypes?:       string
  experienceDescription?: string
  featuredProjects?:   string
  description?:        string
  age?:                number
  height?:             number
  cvUrl?:              string
  hashtags?:           string[]
  trayectoria?:        Array<{ proyecto: string; cliente: string; anio: number }>
  artistAvailability?: boolean
  esProfesor?:         boolean
  tiposClase?:         string[]
  complexion?:         string
  eyeColor?:           string
  hairType?:           string
  hairLength?:         string
  hairColor?:          string
  skills?:             string[]
  agencyProfile?:      string
}

function splitSkills(skills: any): { preset: string[]; customInput: string } {
  const list: string[] = Array.isArray(skills) ? skills : []
  const preset = list.filter((s) => (SKILL_OPTIONS as readonly string[]).includes(s))
  const custom = list.filter((s) => !(SKILL_OPTIONS as readonly string[]).includes(s))
  return { preset, customInput: custom.join(", ") }
}

type Props = {
  sanityId: string
  initialData: ArtistData
}

type SimpleField = { key: string; label: string; multiline?: boolean; select?: boolean; type?: string }

const SIMPLE_FIELDS: SimpleField[] = [
  { key: "name",        label: "Nombre" },
  { key: "city",        label: "Ciudad" },
  { key: "category",    label: "Categoría", select: true },
  { key: "description", label: "Descripción", multiline: true },
  { key: "experience",  label: "Experiencia (años)", type: "number" },
  { key: "projectTypes", label: "¿En qué tipo de proyectos has trabajado?" },
  { key: "experienceDescription", label: "¿Qué experiencia tienes?", multiline: true },
  { key: "featuredProjects", label: "Proyectos destacados", multiline: true },
  { key: "age",         label: "Edad", type: "number" },
  { key: "height",      label: "Estatura (cm)", type: "number" },
]

export default function AdminEditArtistForm({ sanityId, initialData }: Props) {
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [simpleForm, setSimpleForm] = useState<Record<string, string>>({
    name:        initialData.name        ?? "",
    city:        initialData.city        ?? "",
    category:    initialData.category    ?? "",
    description: initialData.description ?? "",
    experience:  String(initialData.experience ?? ""),
    projectTypes: initialData.projectTypes ?? "",
    experienceDescription: initialData.experienceDescription ?? "",
    featuredProjects: initialData.featuredProjects ?? "",
    age:         String(initialData.age         ?? ""),
    height:      String(initialData.height      ?? ""),
    cvUrl:       initialData.cvUrl        ?? "",
    complexion:  initialData.complexion   ?? "",
    eyeColor:    initialData.eyeColor     ?? "",
    hairType:    initialData.hairType     ?? "",
    hairLength:  initialData.hairLength   ?? "",
    hairColor:   initialData.hairColor    ?? "",
    agencyProfile: initialData.agencyProfile ?? "",
  })

  const [hashtagsInput, setHashtagsInput] = useState<string>(
    Array.isArray(initialData.hashtags) ? initialData.hashtags.join(", ") : ""
  )

  const initialSkills = splitSkills(initialData.skills)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills.preset)
  const [customSkillsInput, setCustomSkillsInput] = useState<string>(initialSkills.customInput)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const [trayectoria, setTrayectoria] = useState<TrayectoriaItem[]>(
    Array.isArray(initialData.trayectoria)
      ? initialData.trayectoria.map((t) => ({
          proyecto: t.proyecto ?? "",
          cliente:  t.cliente  ?? "",
          anio:     String(t.anio ?? ""),
        }))
      : []
  )

  const [disponible, setDisponible] = useState<boolean>(
    initialData.artistAvailability ?? true
  )

  const [esProfesor, setEsProfesor] = useState<boolean>(
    initialData.esProfesor ?? false
  )

  const [tiposClase, setTiposClase] = useState<string[]>(
    initialData.tiposClase ?? []
  )

  function toggleTipoClase(tipo: string) {
    setTiposClase((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )
  }

  const [cvUploading, setCvUploading]     = useState(false)
  const [cvUploadError, setCvUploadError] = useState<string | null>(null)
  const [cvFileName, setCvFileName]       = useState<string | null>(null)

  function resetState() {
    setSimpleForm({
      name:        initialData.name        ?? "",
      city:        initialData.city        ?? "",
      category:    initialData.category    ?? "",
      description: initialData.description ?? "",
      experience:  String(initialData.experience ?? ""),
      projectTypes: initialData.projectTypes ?? "",
      experienceDescription: initialData.experienceDescription ?? "",
      featuredProjects: initialData.featuredProjects ?? "",
      age:         String(initialData.age         ?? ""),
      height:      String(initialData.height      ?? ""),
      cvUrl:       initialData.cvUrl        ?? "",
      complexion:  initialData.complexion   ?? "",
      eyeColor:    initialData.eyeColor     ?? "",
      hairType:    initialData.hairType     ?? "",
      hairLength:  initialData.hairLength   ?? "",
      hairColor:   initialData.hairColor    ?? "",
      agencyProfile: initialData.agencyProfile ?? "",
    })
    setHashtagsInput(Array.isArray(initialData.hashtags) ? initialData.hashtags.join(", ") : "")
    const resetSkills = splitSkills(initialData.skills)
    setSelectedSkills(resetSkills.preset)
    setCustomSkillsInput(resetSkills.customInput)
    setTrayectoria(
      Array.isArray(initialData.trayectoria)
        ? initialData.trayectoria.map((t) => ({
            proyecto: t.proyecto ?? "",
            cliente:  t.cliente  ?? "",
            anio:     String(t.anio ?? ""),
          }))
        : []
    )
    setDisponible(initialData.artistAvailability ?? true)
    setEsProfesor(initialData.esProfesor ?? false)
    setTiposClase(initialData.tiposClase ?? [])
  }

  function handleCancel() {
    resetState()
    setFeedback(null)
    setEditing(false)
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCvUploadError(null)
    setCvFileName(null)

    if (file.type !== "application/pdf") {
      setCvUploadError("Solo se permiten archivos PDF.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvUploadError("El archivo no puede superar 10 MB.")
      return
    }

    setCvUploading(true)
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/artist/cv/upload", { method: "POST", body: fd })

    if (res.ok) {
      const { url } = await res.json()
      setSimpleForm((prev) => ({ ...prev, cvUrl: url }))
      setCvFileName(file.name)
    } else {
      const { error } = await res.json().catch(() => ({ error: "Error al subir el archivo." }))
      setCvUploadError(error ?? "Error al subir el archivo.")
    }
    setCvUploading(false)
    e.target.value = ""
  }

  function setTrayField(i: number, field: keyof TrayectoriaItem, value: string) {
    setTrayectoria((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    )
  }

  async function handleSave() {
    setLoading(true)
    setFeedback(null)

    const res = await fetch("/api/admin/artists/update-profile", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sanityId,
        ...simpleForm,
        experience:  simpleForm.experience  ? parseInt(simpleForm.experience)  : undefined,
        age:         simpleForm.age         ? parseInt(simpleForm.age)         : undefined,
        height:      simpleForm.height      ? parseInt(simpleForm.height)      : undefined,
        hashtags:    hashtagsInput.split(",").map((h) => h.trim()).filter(Boolean),
        skills: [
          ...selectedSkills,
          ...customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        ],
        trayectoria: trayectoria.map((t) => ({
          _key:     Math.random().toString(36).slice(2, 10),
          proyecto: t.proyecto,
          cliente:  t.cliente,
          anio:     t.anio ? parseInt(t.anio) : undefined,
        })),
        artistAvailability: disponible,
        esProfesor,
        tiposClase,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setFeedback({ type: "error", text: data.error || "Error al guardar" })
      return
    }

    setFeedback({ type: "success", text: "Perfil actualizado correctamente" })
    setEditing(false)
    router.refresh()
  }

  const inputCls = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl">Datos Actuales</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            ✏ Editar
          </button>
        )}
      </div>

      {feedback && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          feedback.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {feedback.text}
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          {SIMPLE_FIELDS.map(({ key, label, multiline, select, type = "text" }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              {select ? (
                <select
                  value={simpleForm[key] ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Selecciona una categoría</option>
                  {ARTIST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : multiline ? (
                <textarea
                  rows={3}
                  value={simpleForm[key] ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <input
                  type={type}
                  value={simpleForm[key] ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          {/* Hashtags */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              Hashtags (separados por coma)
            </label>
            <input
              type="text"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              placeholder="#rubios, #acrobacias"
              className={inputCls}
            />
          </div>

          {/* Características físicas */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">Características físicas</h3>
            <div className="grid grid-cols-2 gap-4">
              {([
                ["complexion", "Complexión", COMPLEXION_OPTIONS],
                ["eyeColor", "Color de ojos", EYE_COLOR_OPTIONS],
                ["hairType", "Tipo de cabello", HAIR_TYPE_OPTIONS],
                ["hairLength", "Largo del cabello", HAIR_LENGTH_OPTIONS],
                ["hairColor", "Color de cabello", HAIR_COLOR_OPTIONS],
              ] as const).map(([key, label, options]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <select
                    value={simpleForm[key] ?? ""}
                    onChange={(e) => setSimpleForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Selecciona una opción</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Perfil artístico */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">Perfil artístico</h3>

            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                Perfil dentro de la agencia
              </label>
              <select
                value={simpleForm.agencyProfile ?? ""}
                onChange={(e) => setSimpleForm((prev) => ({ ...prev, agencyProfile: e.target.value }))}
                className={inputCls}
              >
                <option value="">Selecciona una opción</option>
                {AGENCY_PROFILE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                Habilidades
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => {
                  const active = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "border-zinc-300 text-zinc-600 hover:border-primary/50"
                      }`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
              <input
                type="text"
                value={customSkillsInput}
                onChange={(e) => setCustomSkillsInput(e.target.value)}
                placeholder="Otras habilidades no listadas arriba (separadas por coma)"
                className={`${inputCls} mt-2`}
              />
            </div>
          </div>

          {/* CV URL + upload */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              CV (URL PDF)
            </label>
            <input
              type="url"
              value={simpleForm.cvUrl ?? ""}
              onChange={(e) => setSimpleForm((prev) => ({ ...prev, cvUrl: e.target.value }))}
              placeholder="https://..."
              className={inputCls}
            />
            {simpleForm.cvUrl && (
              <div className="flex items-center gap-3 mt-1.5">
                <a href={simpleForm.cvUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-zinc-400 underline hover:text-zinc-600">
                  Ver CV actual →
                </a>
                <button
                  type="button"
                  onClick={() => { setSimpleForm((prev) => ({ ...prev, cvUrl: "" })); setCvFileName(null) }}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  × Eliminar CV
                </button>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-dashed border-zinc-200">
              <p className="text-xs text-zinc-400 mb-2">O sube un PDF directamente</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                disabled={cvUploading}
                className="text-sm text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
              />
              {cvUploading && <p className="mt-1.5 text-xs text-zinc-400">Subiendo...</p>}
              {cvFileName && !cvUploading && (
                <p className="mt-1.5 text-xs text-green-600">✓ {cvFileName}</p>
              )}
              {cvUploadError && (
                <p className="mt-1.5 text-xs text-red-600">{cvUploadError}</p>
              )}
              <p className="mt-1 text-xs text-zinc-300">Solo PDF · máx. 10 MB</p>
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center justify-between py-2.5 px-3 border border-zinc-200 rounded-lg">
            <span className="text-sm font-medium text-zinc-700">Disponible actualmente</span>
            <button
              type="button"
              onClick={() => setDisponible((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                disponible ? "bg-green-500" : "bg-zinc-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                disponible ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          {/* Es profesor (solo admin) */}
          <div className="flex items-center justify-between py-2.5 px-3 border border-zinc-200 rounded-lg">
            <span className="text-sm font-medium text-zinc-700">Es profesor</span>
            <button
              type="button"
              onClick={() => setEsProfesor((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                esProfesor ? "bg-green-500" : "bg-zinc-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                esProfesor ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          {/* Tipos de clase (solo si es profesor) */}
          {esProfesor && (
            <div className="py-2.5 px-3 border border-zinc-200 rounded-lg space-y-2">
              <span className="block text-sm font-medium text-zinc-700 mb-1">
                Tipos de clase que ofrece
              </span>
              {TIPOS_CLASE_OPTIONS.map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tiposClase.includes(tipo)}
                    onChange={() => toggleTipoClase(tipo)}
                    className="w-4 h-4 accent-primary"
                  />
                  {tipo}
                </label>
              ))}
            </div>
          )}

          {/* Trayectoria */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
              Trayectoria
            </label>
            <div className="space-y-2">
              {trayectoria.map((item, i) => (
                <div key={i} className="border border-zinc-100 rounded-lg p-3 bg-zinc-50">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Proyecto</label>
                      <input value={item.proyecto} onChange={(e) => setTrayField(i, "proyecto", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Cliente</label>
                      <input value={item.cliente} onChange={(e) => setTrayField(i, "cliente", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Año</label>
                      <input type="number" value={item.anio} onChange={(e) => setTrayField(i, "anio", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <button
                    onClick={() => setTrayectoria((prev) => prev.filter((_, idx) => idx !== i))}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setTrayectoria((prev) => [...prev, { proyecto: "", cliente: "", anio: "" }])}
              className="mt-2 text-xs text-zinc-500 border border-dashed border-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-50 transition-colors w-full"
            >
              + Agregar entrada
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleCancel} disabled={loading} className="px-4 py-2 text-sm font-medium border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      ) : (
        <dl className="space-y-3">
          {SIMPLE_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-zinc-700 mt-0.5">
                {key === "category"
                  ? formatCategoryLabel(initialData.category, initialData.esProfesor) || "—"
                  : (initialData as any)[key] ?? "—"}
              </dd>
            </div>
          ))}

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Hashtags</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.hashtags?.length ? initialData.hashtags.join(", ") : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Complexión</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.complexion ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Color de ojos</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.eyeColor ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Tipo de cabello</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.hairType ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Largo del cabello</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.hairLength ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Color de cabello</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.hairColor ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Perfil dentro de la agencia</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">{initialData.agencyProfile ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Habilidades</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.skills?.length ? initialData.skills.join(", ") : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">CV</dt>
            <dd className="mt-0.5">
              {initialData.cvUrl ? (
                <a href={initialData.cvUrl} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-primary underline hover:text-red-700">
                  Ver CV →
                </a>
              ) : (
                <span className="text-sm text-zinc-700">—</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Disponible</dt>
            <dd className="mt-1">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                initialData.artistAvailability ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
              }`}>
                {initialData.artistAvailability ? "Sí" : "No"}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Es profesor</dt>
            <dd className="mt-1">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                initialData.esProfesor ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
              }`}>
                {initialData.esProfesor ? "Sí" : "No"}
              </span>
            </dd>
          </div>

          {initialData.esProfesor && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Tipos de clase</dt>
              <dd className="text-sm text-zinc-700 mt-0.5">
                {initialData.tiposClase?.length ? initialData.tiposClase.join(", ") : "—"}
              </dd>
            </div>
          )}

          {initialData.trayectoria && initialData.trayectoria.length > 0 && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Trayectoria</dt>
              <dd className="space-y-1.5">
                {initialData.trayectoria.map((t, i) => (
                  <div key={i} className="text-sm bg-zinc-50 rounded-lg px-3 py-2">
                    <span className="font-medium text-zinc-800">{t.proyecto}</span>
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
