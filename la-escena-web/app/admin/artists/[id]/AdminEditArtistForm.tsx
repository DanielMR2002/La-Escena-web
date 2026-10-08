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
  TIPO_PERFIL_OPTIONS,
  DANCE_STYLE_OPTIONS,
  DANCE_STYLE_GROUPS,
} from "@/lib/artistProfileOptions"

type TrayectoriaItem = {
  aniosBailando: string
  aniosExperiencia: string
  edad: string
  estatura: string
}
type PruebaItem = { url: string; title: string; fileType: string }

type ArtistData = {
  name?:               string
  city?:               string
  category?:           string
  experience?:         string | number
  projectTypes?:       string
  experienceDescription?: string
  description?:        string
  age?:                number
  height?:             number
  cvUrl?:              string
  hashtags?:           string[]
  trayectoria?:        { aniosBailando?: number; aniosExperiencia?: number; edad?: number; estatura?: number }
  artistAvailability?: boolean
  esProfesor?:         boolean
  tiposClase?:         string[]
  complexion?:         string
  eyeColor?:           string
  hairType?:           string
  hairLength?:         string
  hairColor?:          string
  skills?:             string[]
  agencyProfile?:      string | string[]
  estilosPrincipales?: string[]
  estilosSecundarios?: string[]
  tipoPerfil?:         string[]
  instagram?:          string
  tiktok?:             string
  youtube?:            string
  socialLinksPublic?:  boolean
  genero?:             string
  generoOtro?:         string
  pruebasTrabajoAprobadas?: PruebaItem[]
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
  hasVideo?: boolean
}

type SimpleField = { key: string; label: string; multiline?: boolean; select?: boolean; type?: string }

const SIMPLE_FIELDS: SimpleField[] = [
  { key: "name",        label: "Nombre" },
  { key: "city",        label: "Ciudad" },
  { key: "category",    label: "Categoría", select: true },
  { key: "description", label: "Descripción", multiline: true },
]

export default function AdminEditArtistForm({ sanityId, initialData, hasVideo }: Props) {
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [simpleForm, setSimpleForm] = useState<Record<string, string>>({
    name:        initialData.name        ?? "",
    city:        initialData.city        ?? "",
    category:    initialData.category    ?? "",
    description: initialData.description ?? "",
    cvUrl:       initialData.cvUrl        ?? "",
    complexion:  initialData.complexion   ?? "",
    eyeColor:    initialData.eyeColor     ?? "",
    hairType:    initialData.hairType     ?? "",
    hairLength:  initialData.hairLength   ?? "",
    hairColor:   initialData.hairColor    ?? "",
    instagram:   initialData.instagram    ?? "",
    tiktok:      initialData.tiktok       ?? "",
    youtube:     initialData.youtube      ?? "",
  })

  // agencyProfile — multi-select
  const [agencyProfiles, setAgencyProfiles] = useState<string[]>(
    Array.isArray(initialData.agencyProfile)
      ? initialData.agencyProfile
      : initialData.agencyProfile ? [initialData.agencyProfile] : []
  )
  function toggleAgencyProfile(value: string) {
    setAgencyProfiles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  // Gender
  const [genero, setGenero] = useState<string>(initialData.genero ?? "")
  const [generoOtro, setGeneroOtro] = useState<string>(initialData.generoOtro ?? "")

  // Social links public visibility
  const [socialLinksPublic, setSocialLinksPublic] = useState<boolean>(
    initialData.socialLinksPublic ?? false
  )

  const [estilosPrincipales, setEstilosPrincipales] = useState<string[]>(
    initialData.estilosPrincipales ?? []
  )
  const [estilosSecundarios, setEstilosSecundarios] = useState<string[]>(
    initialData.estilosSecundarios ?? []
  )

  function toggleEstiloPrincipal(value: string) {
    setEstilosPrincipales((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  function toggleEstiloSecundario(value: string) {
    setEstilosSecundarios((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  const [tiposPerfil, setTiposPerfil] = useState<string[]>(
    initialData.tipoPerfil ?? []
  )

  function toggleTipoPerfil(value: string) {
    setTiposPerfil((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }

  const esCreadorContenido = tiposPerfil.includes("creador-contenido")
  const esCoreografODirector = tiposPerfil.some((t) => ["coreografo", "director"].includes(t))
  const requiresVideo = esCoreografODirector

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

  const initTray = initialData.trayectoria
  const [trayectoria, setTrayectoria] = useState<TrayectoriaItem>({
    aniosBailando:    String(initTray?.aniosBailando    ?? initialData.experience ?? ""),
    aniosExperiencia: String(initTray?.aniosExperiencia ?? ""),
    edad:             String(initTray?.edad             ?? initialData.age        ?? ""),
    estatura:         String(initTray?.estatura         ?? initialData.height     ?? ""),
  })

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

  // Pruebas de trabajo
  const [pruebasSubidas, setPruebasSubidas] = useState<PruebaItem[]>([])
  const [pruebaUploading, setPruebaUploading] = useState(false)
  const [pruebaUploadError, setPruebaUploadError] = useState<string | null>(null)
  const pruebasAprobadas: PruebaItem[] = initialData.pruebasTrabajoAprobadas ?? []

  async function handlePruebaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPruebaUploadError(null)
    setPruebaUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/artist/prueba-trabajo/upload", { method: "POST", body: fd })
    if (res.ok) {
      const { url, name, type } = await res.json()
      setPruebasSubidas((prev) => [...prev, { url, title: name, fileType: type }])
    } else {
      const { error } = await res.json().catch(() => ({ error: "Error al subir el archivo." }))
      setPruebaUploadError(error ?? "Error al subir el archivo.")
    }
    setPruebaUploading(false)
    e.target.value = ""
  }

  function resetState() {
    setSimpleForm({
      name:        initialData.name        ?? "",
      city:        initialData.city        ?? "",
      category:    initialData.category    ?? "",
      description: initialData.description ?? "",
      cvUrl:       initialData.cvUrl        ?? "",
      complexion:  initialData.complexion   ?? "",
      eyeColor:    initialData.eyeColor     ?? "",
      hairType:    initialData.hairType     ?? "",
      hairLength:  initialData.hairLength   ?? "",
      hairColor:   initialData.hairColor    ?? "",
      instagram:   initialData.instagram    ?? "",
      tiktok:      initialData.tiktok       ?? "",
      youtube:     initialData.youtube      ?? "",
    })
    setAgencyProfiles(
      Array.isArray(initialData.agencyProfile)
        ? initialData.agencyProfile
        : initialData.agencyProfile ? [initialData.agencyProfile] : []
    )
    setGenero(initialData.genero ?? "")
    setGeneroOtro(initialData.generoOtro ?? "")
    setSocialLinksPublic(initialData.socialLinksPublic ?? false)
    setHashtagsInput(Array.isArray(initialData.hashtags) ? initialData.hashtags.join(", ") : "")
    const resetSkills = splitSkills(initialData.skills)
    setSelectedSkills(resetSkills.preset)
    setCustomSkillsInput(resetSkills.customInput)
    setTrayectoria({
      aniosBailando:    String(initTray?.aniosBailando    ?? initialData.experience ?? ""),
      aniosExperiencia: String(initTray?.aniosExperiencia ?? ""),
      edad:             String(initTray?.edad             ?? initialData.age        ?? ""),
      estatura:         String(initTray?.estatura         ?? initialData.height     ?? ""),
    })
    setDisponible(initialData.artistAvailability ?? true)
    setEsProfesor(initialData.esProfesor ?? false)
    setTiposClase(initialData.tiposClase ?? [])
    setEstilosPrincipales(initialData.estilosPrincipales ?? [])
    setEstilosSecundarios(initialData.estilosSecundarios ?? [])
    setTiposPerfil(initialData.tipoPerfil ?? [])
    setPruebasSubidas([])
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

  function setTrayField(field: keyof TrayectoriaItem, value: string) {
    setTrayectoria((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setLoading(true)
    setFeedback(null)

    const body: any = {
      sanityId,
      ...simpleForm,
      agencyProfile: agencyProfiles,
      genero,
      generoOtro,
      socialLinksPublic,
      experience:  trayectoria.aniosBailando    ? parseInt(trayectoria.aniosBailando)    : undefined,
      age:         trayectoria.edad             ? parseInt(trayectoria.edad)             : undefined,
      height:      trayectoria.estatura         ? parseInt(trayectoria.estatura)         : undefined,
      hashtags:    hashtagsInput.split(",").map((h) => h.trim()).filter(Boolean),
      skills: [
        ...selectedSkills,
        ...customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      ],
      trayectoria: {
        aniosBailando:    trayectoria.aniosBailando    ? parseInt(trayectoria.aniosBailando)    : undefined,
        aniosExperiencia: trayectoria.aniosExperiencia ? parseInt(trayectoria.aniosExperiencia) : undefined,
        edad:             trayectoria.edad             ? parseInt(trayectoria.edad)             : undefined,
        estatura:         trayectoria.estatura         ? parseInt(trayectoria.estatura)         : undefined,
      },
      artistAvailability: disponible,
      esProfesor,
      tiposClase,
      estilosPrincipales,
      estilosSecundarios,
      tipoPerfil: tiposPerfil,
    }

    if (pruebasSubidas.length > 0) {
      body.pruebasTrabajo = pruebasSubidas.map((p) => ({
        _key: Math.random().toString(36).slice(2, 10),
        ...p,
      }))
    }

    const res = await fetch("/api/admin/artists/update-profile", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setFeedback({ type: "error", text: data.error || "Error al guardar" })
      return
    }

    setFeedback({ type: "success", text: "Perfil actualizado correctamente" })
    if (pruebasSubidas.length > 0) setPruebasSubidas([])
    setEditing(false)
    router.refresh()
  }

  const inputCls = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl text-zinc-900">Datos Actuales</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
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

          {/* Género */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">Género / Identidad</h3>
            <div className="space-y-2">
              {[
                { label: "Masculino", value: "masculino" },
                { label: "Femenino",  value: "femenino" },
                { label: "Otros",     value: "otros" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="radio"
                    name="genero"
                    value={opt.value}
                    checked={genero === opt.value}
                    onChange={() => setGenero(opt.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {genero === "otros" && (
              <div className="mt-2">
                <label className="block text-xs text-zinc-400 mb-1">Especifica</label>
                <input
                  value={generoOtro}
                  onChange={(e) => setGeneroOtro(e.target.value)}
                  placeholder="¿Cómo se identifica?"
                  className={inputCls}
                />
              </div>
            )}
          </div>

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

            {/* agencyProfile — multi-select checkboxes */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                Perfil dentro de la agencia
              </label>
              <div className="space-y-1.5">
                {AGENCY_PROFILE_OPTIONS.map((o) => (
                  <label key={o} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agencyProfiles.includes(o)}
                      onChange={() => toggleAgencyProfile(o)}
                      className="w-4 h-4 accent-primary"
                    />
                    {o}
                  </label>
                ))}
              </div>
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

          {/* Tipo de perfil */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">Tipo de perfil</h3>
            <div className="space-y-2">
              {TIPO_PERFIL_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tiposPerfil.includes(opt.value)}
                    onChange={() => toggleTipoPerfil(opt.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {requiresVideo && (
              <p className={`mt-3 text-xs ${hasVideo ? "text-green-600" : "text-red-600"}`}>
                * Como coreógrafo/a o director/a, debe incluir al menos un video de su trabajo en la sección de Videos.
                {hasVideo ? " ✓ Ya tiene un video." : " Aún no tiene ningún video."}
              </p>
            )}

            {/* Redes sociales — visible siempre en admin, con toggle de visibilidad pública */}
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer p-2 bg-sky-50 rounded-lg border border-sky-200">
                <input
                  type="checkbox"
                  checked={socialLinksPublic}
                  onChange={(e) => setSocialLinksPublic(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-medium">Mostrar redes sociales en perfil público</span>
              </label>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                  Instagram
                </label>
                <input
                  type="text"
                  value={simpleForm.instagram ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, instagram: e.target.value }))}
                  placeholder="https://instagram.com/..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                  TikTok
                </label>
                <input
                  type="text"
                  value={simpleForm.tiktok ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, tiktok: e.target.value }))}
                  placeholder="https://tiktok.com/@..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                  YouTube
                </label>
                <input
                  type="text"
                  value={simpleForm.youtube ?? ""}
                  onChange={(e) => setSimpleForm((prev) => ({ ...prev, youtube: e.target.value }))}
                  placeholder="https://youtube.com/@..."
                  className={inputCls}
                />
              </div>
            </div>

            {/* Pruebas de trabajo — coreógrafo/director */}
            {esCoreografODirector && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-sm font-semibold text-zinc-700 mb-2">Pruebas de trabajo</h4>
                <p className="text-xs text-zinc-500 mb-3">
                  Sube pruebas de trabajo del artista. Se guardarán como pendientes hasta que las apruebes desde Sanity.
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/x-msvideo,video/webm"
                  onChange={handlePruebaUpload}
                  disabled={pruebaUploading}
                  className="text-sm text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                />
                {pruebaUploading && <p className="mt-1.5 text-xs text-zinc-400">Subiendo...</p>}
                {pruebaUploadError && <p className="mt-1.5 text-xs text-red-600">{pruebaUploadError}</p>}

                {pruebasSubidas.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold text-zinc-600 mb-1">Pendientes de guardar:</p>
                    {pruebasSubidas.map((p, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs">
                        <span className="text-zinc-700">{p.title}</span>
                        <button
                          type="button"
                          onClick={() => setPruebasSubidas((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          × Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {pruebasAprobadas.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold text-green-700 mb-1">✓ Aprobadas:</p>
                    {pruebasAprobadas.map((p, i) => (
                      <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                         className="block px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 underline hover:text-green-900">
                        {p.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Estilos Principales */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">
              Estilos Principales (máx. 3 recomendados)
            </h3>
            {DANCE_STYLE_GROUPS.map((group) => (
              <div key={group.category} className="mb-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.styles.map((style) => {
                    const active = estilosPrincipales.includes(style.value)
                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => toggleEstiloPrincipal(style.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "border-zinc-300 text-zinc-600 hover:border-primary/50"
                        }`}
                      >
                        {style.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Estilos Secundarios */}
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3 mt-3">Estilos Secundarios</h3>
            {DANCE_STYLE_GROUPS.map((group) => (
              <div key={group.category} className="mb-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.styles.map((style) => {
                    const active = estilosSecundarios.includes(style.value)
                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => toggleEstiloSecundario(style.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          active
                            ? "bg-sky-500 text-white border-sky-500"
                            : "border-zinc-300 text-zinc-600 hover:border-sky-400"
                        }`}
                      >
                        {style.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Años bailando</label>
                <input type="number" min={0} max={80} value={trayectoria.aniosBailando}
                  onChange={(e) => setTrayField("aniosBailando", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Años de experiencia trabajando</label>
                <input type="number" min={0} max={80} value={trayectoria.aniosExperiencia}
                  onChange={(e) => setTrayField("aniosExperiencia", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Edad</label>
                <input type="number" min={0} max={120} value={trayectoria.edad}
                  onChange={(e) => setTrayField("edad", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Estatura (cm)</label>
                <input type="number" min={100} max={250} value={trayectoria.estatura}
                  onChange={(e) => setTrayField("estatura", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleCancel} disabled={loading} className="px-4 py-2 text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50">
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
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Género</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.genero === "otros" && initialData.generoOtro
                ? initialData.generoOtro
                : initialData.genero ?? "—"}
            </dd>
          </div>

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
            <dd className="text-sm text-zinc-700 mt-0.5">
              {Array.isArray(initialData.agencyProfile)
                ? initialData.agencyProfile.join(", ") || "—"
                : initialData.agencyProfile ?? "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Habilidades</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.skills?.length ? initialData.skills.join(", ") : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Tipo de perfil</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.tipoPerfil?.length
                ? initialData.tipoPerfil
                    .map((v) => TIPO_PERFIL_OPTIONS.find((o) => o.value === v)?.label ?? v)
                    .join(", ")
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Redes sociales</dt>
            <dd className="text-sm text-zinc-700 mt-0.5 space-y-0.5">
              <span className={`inline-flex mr-3 px-2 py-0.5 rounded-full text-xs font-medium ${
                initialData.socialLinksPublic ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
              }`}>
                {initialData.socialLinksPublic ? "Visibles al público" : "Ocultas al público"}
              </span>
              {initialData.instagram && <span className="block">IG: {initialData.instagram}</span>}
              {initialData.tiktok && <span className="block">TikTok: {initialData.tiktok}</span>}
              {initialData.youtube && <span className="block">YouTube: {initialData.youtube}</span>}
              {!initialData.instagram && !initialData.tiktok && !initialData.youtube && <span>—</span>}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Estilos Principales</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.estilosPrincipales?.length
                ? initialData.estilosPrincipales
                    .map((v) => DANCE_STYLE_OPTIONS.find((o) => o.value === v)?.label ?? v)
                    .join(", ")
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Estilos Secundarios</dt>
            <dd className="text-sm text-zinc-700 mt-0.5">
              {initialData.estilosSecundarios?.length
                ? initialData.estilosSecundarios
                    .map((v) => DANCE_STYLE_OPTIONS.find((o) => o.value === v)?.label ?? v)
                    .join(", ")
                : "—"}
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

          {initialData.trayectoria && (
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Trayectoria</dt>
              <dd className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div>
                  <span className="text-xs text-zinc-400">Años bailando</span>
                  <p className="text-sm text-zinc-700">{(initialData.trayectoria as any).aniosBailando ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Años experiencia trabajando</span>
                  <p className="text-sm text-zinc-700">{(initialData.trayectoria as any).aniosExperiencia ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Edad</span>
                  <p className="text-sm text-zinc-700">{(initialData.trayectoria as any).edad ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Estatura</span>
                  <p className="text-sm text-zinc-700">{(initialData.trayectoria as any).estatura ? `${(initialData.trayectoria as any).estatura} cm` : "—"}</p>
                </div>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
