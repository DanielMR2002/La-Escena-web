"use client"

import { useState, useMemo } from "react"
import {
  COMPLEXION_OPTIONS,
  EYE_COLOR_OPTIONS,
  HAIR_TYPE_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_COLOR_OPTIONS,
  SKILL_OPTIONS,
  AGENCY_PROFILE_OPTIONS,
  TIPOS_CLASE_OPTIONS,
  STYLE_OPTIONS,
  TIPO_PERFIL_OPTIONS,
  DANCE_STYLE_GROUPS,
} from "@/lib/artistProfileOptions"

type TrayectoriaItem = {
  aniosBailando: string
  aniosExperiencia: string
  edad: string
  estatura: string
}

type ArtistFormState = {
  name: string
  city: string
  category: string
  description: string
  cvUrl: string
  complexion: string
  eyeColor: string
  hairType: string
  hairLength: string
  hairColor: string
  instagram: string
  tiktok: string
  youtube: string
}

type PruebaItem = { url: string; title: string; fileType: string }

function splitSkills(skills: any): { preset: string[]; customInput: string } {
  const list: string[] = Array.isArray(skills) ? skills : []
  const preset = list.filter((s) => (SKILL_OPTIONS as readonly string[]).includes(s))
  const custom = list.filter((s) => !(SKILL_OPTIONS as readonly string[]).includes(s))
  return { preset, customInput: custom.join(", ") }
}

export default function EditArtistForm({
  artistId,
  sanityId,
  isAdmin,
  esProfesor,
  hasPendingMedia,
  hasVideo,
  nameIsLocked,
  initialData,
  lastRejectedRevision,
}: {
  artistId: string
  sanityId?: string | null
  isAdmin?: boolean
  esProfesor?: boolean
  hasPendingMedia?: boolean
  hasVideo?: boolean
  nameIsLocked?: boolean
  initialData: any
  lastRejectedRevision: any
}) {
  const [form, setForm] = useState<ArtistFormState>({
    name:        initialData?.name        ?? "",
    city:        initialData?.city        ?? "",
    category:    initialData?.category    ?? "",
    description: initialData?.description ?? "",
    cvUrl:       initialData?.cvUrl        ?? "",
    complexion:  initialData?.complexion  ?? "",
    eyeColor:    initialData?.eyeColor    ?? "",
    hairType:    initialData?.hairType    ?? "",
    hairLength:  initialData?.hairLength  ?? "",
    hairColor:   initialData?.hairColor   ?? "",
    instagram:    initialData?.instagram    ?? "",
    tiktok:       initialData?.tiktok       ?? "",
    youtube:      initialData?.youtube      ?? "",
  })

  // agencyProfile — multi-select checkboxes (string[])
  const [agencyProfiles, setAgencyProfiles] = useState<string[]>(
    Array.isArray(initialData?.agencyProfile)
      ? initialData.agencyProfile
      : initialData?.agencyProfile
        ? [initialData.agencyProfile]
        : []
  )
  function toggleAgencyProfile(value: string) {
    setAgencyProfiles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  // Gender / identity
  const [genero, setGenero] = useState<string>(initialData?.genero ?? "")
  const [generoOtro, setGeneroOtro] = useState<string>(initialData?.generoOtro ?? "")

  // Social links visibility (admin only)
  const [socialLinksPublic, setSocialLinksPublic] = useState<boolean>(
    initialData?.socialLinksPublic ?? false
  )

  const [availability, setAvailability] = useState<boolean>(
    initialData?.artistAvailability ?? true
  )

  const [hashtagsInput, setHashtagsInput] = useState<string>(
    Array.isArray(initialData?.hashtags)
      ? initialData.hashtags.join(", ")
      : (initialData?.hashtags ?? "")
  )

  const initialSkills = useMemo(() => splitSkills(initialData?.skills), [initialData])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills.preset)
  const [customSkillsInput, setCustomSkillsInput] = useState<string>(initialSkills.customInput)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const [tiposClase, setTiposClase] = useState<string[]>(
    Array.isArray(initialData?.tiposClase) ? initialData.tiposClase : []
  )

  function toggleTipoClase(tipo: string) {
    setTiposClase((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )
  }

  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    Array.isArray(initialData?.styles) ? initialData.styles : []
  )

  function toggleStyle(style: string) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  const [estilosPrincipales, setEstilosPrincipales] = useState<string[]>(
    Array.isArray(initialData?.estilosPrincipales) ? initialData.estilosPrincipales : []
  )
  const [estilosSecundarios, setEstilosSecundarios] = useState<string[]>(
    Array.isArray(initialData?.estilosSecundarios) ? initialData.estilosSecundarios : []
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
    Array.isArray(initialData?.tipoPerfil) ? initialData.tipoPerfil : []
  )

  function toggleTipoPerfil(value: string) {
    setTiposPerfil((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }

  const esCreadorContenido = tiposPerfil.includes("creador-contenido")
  const esCoreografODirector = tiposPerfil.some((t) => ["coreografo", "director"].includes(t))
  const requiresVideo = esCoreografODirector

  // Pruebas de trabajo
  const [pruebasSubidas, setPruebasSubidas] = useState<PruebaItem[]>([])
  const [pruebaUploading, setPruebaUploading] = useState(false)
  const [pruebaUploadError, setPruebaUploadError] = useState<string | null>(null)
  const pruebasAprobadas: PruebaItem[] = initialData?.pruebasTrabajoAprobadas ?? []

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

  const [formError, setFormError] = useState<string | null>(null)

  // Trayectoria is now a single object with 4 fields (not an array of projects)
  const initialTray = initialData?.trayectoria
  const [trayectoria, setTrayectoria] = useState<TrayectoriaItem>({
    aniosBailando:    String(initialTray?.aniosBailando    ?? initialData?.experience ?? ""),
    aniosExperiencia: String(initialTray?.aniosExperiencia ?? ""),
    edad:             String(initialTray?.edad             ?? initialData?.age        ?? ""),
    estatura:         String(initialTray?.estatura         ?? initialData?.height     ?? ""),
  })

  const [showComment, setShowComment] = useState(true)
  const [loading, setLoading]         = useState(false)
  const [sent, setSent]               = useState(false)

  const [cvUploading, setCvUploading]   = useState(false)
  const [cvUploadError, setCvUploadError] = useState<string | null>(null)
  const [cvFileName, setCvFileName]     = useState<string | null>(null)

  const NIVEL_OPTIONS = ["Principiante", "Intermedio", "Avanzado", "Todos los niveles"]
  const [horarios, setHorarios] = useState<string>(initialData?.horarios ?? "")
  const [niveles, setNiveles] = useState<string[]>(
    Array.isArray(initialData?.niveles) ? initialData.niveles : []
  )
  function toggleNivel(nivel: string) {
    setNiveles((prev) =>
      prev.includes(nivel) ? prev.filter((n) => n !== nivel) : [...prev, nivel]
    )
  }

  const estauraNum = trayectoria.estatura ? parseInt(trayectoria.estatura) : null
  const heightError = estauraNum !== null && !isNaN(estauraNum) && (estauraNum < 100 || estauraNum > 250)
    ? "La estatura debe estar entre 100 y 250 cm"
    : null

  const initialSnapshot = useMemo(() => JSON.stringify({
    form: {
      name:        initialData?.name        ?? "",
      city:        initialData?.city        ?? "",
      category:    initialData?.category    ?? "",
      description: initialData?.description ?? "",
      cvUrl:       initialData?.cvUrl        ?? "",
      complexion:  initialData?.complexion  ?? "",
      eyeColor:    initialData?.eyeColor    ?? "",
      hairType:    initialData?.hairType    ?? "",
      hairLength:  initialData?.hairLength  ?? "",
      hairColor:   initialData?.hairColor   ?? "",
      instagram:    initialData?.instagram    ?? "",
      tiktok:       initialData?.tiktok       ?? "",
      youtube:      initialData?.youtube      ?? "",
    },
    agencyProfiles: Array.isArray(initialData?.agencyProfile)
      ? initialData.agencyProfile
      : initialData?.agencyProfile ? [initialData.agencyProfile] : [],
    genero: initialData?.genero ?? "",
    generoOtro: initialData?.generoOtro ?? "",
    availability: initialData?.artistAvailability ?? true,
    hashtagsInput: Array.isArray(initialData?.hashtags)
      ? initialData.hashtags.join(", ")
      : (initialData?.hashtags ?? ""),
    trayectoria: {
      aniosBailando:    String(initialTray?.aniosBailando    ?? initialData?.experience ?? ""),
      aniosExperiencia: String(initialTray?.aniosExperiencia ?? ""),
      edad:             String(initialTray?.edad             ?? initialData?.age        ?? ""),
      estatura:         String(initialTray?.estatura         ?? initialData?.height     ?? ""),
    },
    selectedSkills: initialSkills.preset,
    customSkillsInput: initialSkills.customInput,
    tiposClase: Array.isArray(initialData?.tiposClase) ? initialData.tiposClase : [],
    selectedStyles: Array.isArray(initialData?.styles) ? initialData.styles : [],
    estilosPrincipales: Array.isArray(initialData?.estilosPrincipales) ? initialData.estilosPrincipales : [],
    estilosSecundarios: Array.isArray(initialData?.estilosSecundarios) ? initialData.estilosSecundarios : [],
    tiposPerfil: Array.isArray(initialData?.tipoPerfil) ? initialData.tipoPerfil : [],
    niveles: Array.isArray(initialData?.niveles) ? initialData.niveles : [],
    horarios: initialData?.horarios ?? "",
  }), [initialData]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasChanges = JSON.stringify({
    form, agencyProfiles, genero, generoOtro, availability, hashtagsInput, trayectoria,
    selectedSkills, customSkillsInput, tiposClase, selectedStyles,
    estilosPrincipales, estilosSecundarios, tiposPerfil, niveles, horarios,
  }) !== initialSnapshot || pruebasSubidas.length > 0

  function set(field: keyof ArtistFormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
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
      setForm((prev) => ({ ...prev, cvUrl: url }))
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

  const handleSubmit = async () => {
    if (heightError) { setFormError(heightError); return }

    setFormError(null)
    if (requiresVideo && !hasVideo && pruebasSubidas.length === 0) {
      setFormError("Los coreógrafos y directores deben incluir al menos un video o prueba de trabajo.")
      return
    }

    setLoading(true)

    const data: any = {
      ...form,
      agencyProfile: agencyProfiles,
      genero,
      generoOtro,
      experience:  trayectoria.aniosBailando   ? parseInt(trayectoria.aniosBailando)   : undefined,
      age:         trayectoria.edad            ? parseInt(trayectoria.edad)            : undefined,
      height:      trayectoria.estatura        ? parseInt(trayectoria.estatura)        : undefined,
      hashtags:    hashtagsInput.split(",").map((h) => h.trim()).filter(Boolean),
      skills: [
        ...selectedSkills,
        ...customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      ],
      tiposClase,
      styles: selectedStyles,
      estilosPrincipales,
      estilosSecundarios,
      tipoPerfil: tiposPerfil,
      niveles,
      horarios,
      ...(hasPendingMedia ? { hasPendingMedia: true } : {}),
      artistAvailability: availability,
      trayectoria: {
        aniosBailando:    trayectoria.aniosBailando    ? parseInt(trayectoria.aniosBailando)    : undefined,
        aniosExperiencia: trayectoria.aniosExperiencia ? parseInt(trayectoria.aniosExperiencia) : undefined,
        edad:             trayectoria.edad             ? parseInt(trayectoria.edad)             : undefined,
        estatura:         trayectoria.estatura         ? parseInt(trayectoria.estatura)         : undefined,
      },
    }

    if (pruebasSubidas.length > 0) {
      data.pruebasTrabajo = pruebasSubidas.map((p) => ({
        _key: Math.random().toString(36).slice(2, 10),
        ...p,
      }))
    }

    if (isAdmin) {
      data.socialLinksPublic = socialLinksPublic
    }

    if (isAdmin && sanityId) {
      await fetch("/api/admin/artists/update-profile", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ sanityId, ...data }),
      })
    } else {
      await fetch("/api/artist/revision/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ artistId, data }),
      })
    }

    setLoading(false)
    setSent(true)
    if (pruebasSubidas.length > 0) setPruebasSubidas([])
  }

  const isDisabled =
    loading ||
    !!heightError ||
    (!isAdmin && sent) ||
    (!isAdmin && !hasChanges) ||
    (requiresVideo && !hasVideo && pruebasSubidas.length === 0)

  const inputCls = "bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
  const labelCls = "text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block"
  const helperCls = "text-xs text-zinc-500 mt-1"

  function SectionHeader({ n, title }: { n: number; title: string }) {
    return (
      <div className="flex items-center gap-3 mb-5">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
          {n}
        </span>
        <h3 className="font-heading text-xl text-white tracking-wide">{title}</h3>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-5">

      {lastRejectedRevision && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-red-200">
          <button
            onClick={() => setShowComment(!showComment)}
            className="text-sm font-semibold text-red-300 hover:text-red-100 transition-colors mb-2 block"
          >
            {showComment ? "Ocultar comentario" : "Mostrar comentario"}
          </button>
          {showComment && (
            <>
              <p className="font-semibold text-red-100">Tu última revisión fue rechazada:</p>
              <p className="mt-2 text-sm">{lastRejectedRevision.adminComment}</p>
            </>
          )}
        </div>
      )}

      {sent && (
        isAdmin ? (
          <div className="bg-green-950 border border-green-800 rounded-xl p-4 text-green-200">
            <p className="font-semibold">Perfil actualizado correctamente.</p>
          </div>
        ) : (
          <div className="bg-green-950 border border-green-800 rounded-xl p-4 text-green-200 space-y-2">
            <p className="font-semibold text-green-100">¡Tu información fue actualizada correctamente!</p>
            <p className="text-sm">
              Tu perfil será revisado por nuestro equipo y próximamente recibirás una notificación confirmando si la nueva información fue aprobada y actualizada dentro de la agencia.
            </p>
            <p className="text-sm">
              Gracias por mantener tu perfil actualizado y seguir creciendo junto a LA ESCENA.
            </p>
          </div>
        )
      )}

      {/* Card 1 — Identidad */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={1} title="Identidad" />

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nombre artístico</label>
            <input
              value={form.name}
              onChange={nameIsLocked ? undefined : set("name")}
              readOnly={nameIsLocked}
              className={`${inputCls} ${nameIsLocked ? "text-zinc-500 cursor-not-allowed" : ""}`}
            />
            {nameIsLocked && (
              <p className={helperCls}>
                El nombre artístico no puede modificarse una vez que ha sido aprobado.
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Ciudad</label>
            <input value={form.city} onChange={set("city")} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Género / Identidad</label>
            <div className="flex flex-col gap-2 mt-1">
              {[
                { label: "Masculino", value: "masculino" },
                { label: "Femenino",  value: "femenino" },
                { label: "Otros",     value: "otros" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                  <input
                    type="radio"
                    name="genero"
                    value={opt.value}
                    checked={genero === opt.value}
                    onChange={() => setGenero(opt.value)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {genero === "otros" && (
              <div className="mt-3">
                <label className={labelCls}>Especifica</label>
                <input
                  value={generoOtro}
                  onChange={(e) => setGeneroOtro(e.target.value)}
                  placeholder="¿Cómo te identificas?"
                  className={inputCls}
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
              <span className="font-semibold text-white">Disponible para proyectos</span>
            </label>
          </div>
        </div>
      </div>

      {/* Card 2 — Sobre ti */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={2} title="Sobre ti" />

        <div className="space-y-4">
          <div>
            <label className={labelCls}>¿Quién eres como artista y persona?</label>
            <textarea value={form.description} onChange={set("description")} rows={4} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Hashtags</label>
            <input
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              placeholder="#salsa, #contemporáneo"
              className={inputCls}
            />
            <p className={helperCls}>
              Etiquetas que describen tu estilo, separadas por coma. Ej: #salsa, #contemporáneo
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 — Estilos de baile */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={3} title="Estilos de baile" />

        <p className="text-xs text-zinc-500 mb-4">
          Selecciona los estilos que bailas o que representan tu perfil artístico
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => {
            const active = selectedStyles.includes(style)
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`border rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {style}
              </button>
            )
          })}
        </div>
      </div>

      {/* Card 4 — Tipo de perfil */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={4} title="Tipo de perfil" />

        <div className="space-y-4">
          <div>
            <label className={labelCls}>¿Cómo te gustaría ser representado?</label>
            <div className="flex flex-col gap-2 mt-1">
              {AGENCY_PROFILE_OPTIONS.map((o) => (
                <label key={o} className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={agencyProfiles.includes(o)}
                    onChange={() => toggleAgencyProfile(o)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-4">
            <label className={labelCls}>Tipo de perfil</label>
            <div className="flex flex-col gap-2 mt-1">
              {TIPO_PERFIL_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={tiposPerfil.includes(opt.value)}
                    onChange={() => toggleTipoPerfil(opt.value)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {requiresVideo && (
            <p className={`text-sm ${(hasVideo || pruebasSubidas.length > 0) ? "text-green-400" : "text-red-400"}`}>
              * Como coreógrafo/a o director/a, debes incluir al menos un video o prueba de trabajo.
              {(hasVideo || pruebasSubidas.length > 0) ? " ✓ Requisito cumplido." : " Aún no has subido ninguno."}
            </p>
          )}

          {(esCreadorContenido || isAdmin) && (
            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
              {isAdmin && (
                <label className="flex items-center gap-3 cursor-pointer bg-blue-950 border border-blue-800 rounded-lg p-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={socialLinksPublic}
                    onChange={(e) => setSocialLinksPublic(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <span className="font-semibold text-blue-200">Mostrar redes sociales en perfil público</span>
                </label>
              )}
              <div>
                <label className={labelCls}>Instagram</label>
                <input value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>TikTok</label>
                <input value={form.tiktok} onChange={set("tiktok")} placeholder="https://tiktok.com/@..." className={inputCls} />
              </div>
            </div>
          )}

          {esCoreografODirector && (
            <div className="bg-amber-950 border border-amber-800 rounded-xl p-4">
              <label className="text-xs font-semibold text-amber-200 uppercase tracking-wide mb-2 block">
                Pruebas de trabajo
              </label>
              <p className="text-xs text-amber-300/80 mb-3">
                Sube imágenes o videos de tu trabajo coreográfico. Serán revisados por el equipo antes de publicarse.
                Formatos: jpg, png, mp4, mov · Máx. 100 MB por archivo.
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/x-msvideo,video/webm"
                onChange={handlePruebaUpload}
                disabled={pruebaUploading}
                className="text-sm text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-800 file:text-amber-100 hover:file:bg-amber-700 disabled:opacity-50"
              />
              {pruebaUploading && (
                <p className="mt-2 text-xs text-zinc-400">Subiendo...</p>
              )}
              {pruebaUploadError && (
                <p className="mt-2 text-xs text-red-400">{pruebaUploadError}</p>
              )}

              {pruebasSubidas.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-amber-200 mb-1">Pendientes de envío:</p>
                  {pruebasSubidas.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300">
                      <span>{p.title}</span>
                      <button
                        type="button"
                        onClick={() => setPruebasSubidas((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-300 transition-colors ml-3"
                      >
                        × Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {pruebasAprobadas.length > 0 && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-semibold text-green-400 mb-1">✓ Aprobadas:</p>
                  {pruebasAprobadas.map((p, i) => (
                    <div key={i} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline transition-colors">
                        {p.title}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card 5 — Trayectoria */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={5} title="Trayectoria" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Años bailando</label>
            <input
              type="number" min={0} max={80}
              value={trayectoria.aniosBailando}
              onChange={(e) => setTrayField("aniosBailando", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Años de experiencia trabajando</label>
            <input
              type="number" min={0} max={80}
              value={trayectoria.aniosExperiencia}
              onChange={(e) => setTrayField("aniosExperiencia", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Edad</label>
            <input
              type="number" min={0} max={120}
              value={trayectoria.edad}
              onChange={(e) => setTrayField("edad", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Estatura (cm)</label>
            <input
              type="number" min={100} max={250}
              value={trayectoria.estatura}
              onChange={(e) => setTrayField("estatura", e.target.value)}
              className={inputCls}
            />
            {heightError && (
              <p className="text-xs text-red-400 mt-1">{heightError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card 6 — Características físicas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={6} title="Características físicas" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Complexión</label>
            <select value={form.complexion} onChange={set("complexion")} className={inputCls}>
              <option value="">Selecciona una opción</option>
              {COMPLEXION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Color de ojos</label>
            <select value={form.eyeColor} onChange={set("eyeColor")} className={inputCls}>
              <option value="">Selecciona una opción</option>
              {EYE_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tipo de cabello</label>
            <select value={form.hairType} onChange={set("hairType")} className={inputCls}>
              <option value="">Selecciona una opción</option>
              {HAIR_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Largo del cabello</label>
            <select value={form.hairLength} onChange={set("hairLength")} className={inputCls}>
              <option value="">Selecciona una opción</option>
              {HAIR_LENGTH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Color de cabello</label>
            <select value={form.hairColor} onChange={set("hairColor")} className={inputCls}>
              <option value="">Selecciona una opción</option>
              {HAIR_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Card 7 — Habilidades */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={7} title="Habilidades" />

        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => {
            const active = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`border rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {skill}
              </button>
            )
          })}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Otras habilidades</label>
          <input
            value={customSkillsInput}
            onChange={(e) => setCustomSkillsInput(e.target.value)}
            placeholder="Otras habilidades no listadas arriba"
            className={inputCls}
          />
          <p className={helperCls}>Otras habilidades separadas por coma</p>
        </div>
      </div>

      {/* Card 8 — CV */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <SectionHeader n={8} title="CV" />

        <div>
          <label className={labelCls}>URL del CV (PDF)</label>
          <input type="url" value={form.cvUrl} onChange={set("cvUrl")} placeholder="https://..." className={inputCls} />
          {form.cvUrl && (
            <div className="flex items-center gap-4 mt-2">
              <a href={form.cvUrl} target="_blank" rel="noopener noreferrer"
                 className="text-xs text-zinc-400 hover:text-white underline transition-colors">
                Ver CV →
              </a>
              <button
                type="button"
                onClick={() => { setForm((prev) => ({ ...prev, cvUrl: "" })); setCvFileName(null) }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                × Eliminar
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-zinc-700 pt-4 mt-4">
          <label className={labelCls}>O sube un PDF directamente</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCvUpload}
            disabled={cvUploading}
            className="mt-1 text-sm text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600 disabled:opacity-50"
          />
          {cvUploading && (
            <p className="mt-2 text-xs text-zinc-400">Subiendo...</p>
          )}
          {cvFileName && !cvUploading && (
            <p className="mt-2 text-xs text-green-400">✓ {cvFileName}</p>
          )}
          {cvUploadError && (
            <p className="mt-2 text-xs text-red-400">{cvUploadError}</p>
          )}
          <p className={helperCls}>Solo PDF · máx. 10 MB</p>
        </div>
      </div>

      {/* Card 9 — Como profesor (only if esProfesor) */}
      {esProfesor && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <SectionHeader n={9} title="Como profesor" />

          <div className="space-y-6">
            <div>
              <label className={labelCls}>Estilos principales (máx. 3)</label>
              <div className="mt-3 space-y-3">
                {DANCE_STYLE_GROUPS.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.styles.map((style) => {
                        const active = estilosPrincipales.includes(style.value)
                        return (
                          <button
                            key={style.value}
                            type="button"
                            onClick={() => toggleEstiloPrincipal(style.value)}
                            className={`border rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
                              active
                                ? "bg-primary text-white border-primary"
                                : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
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
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <label className={labelCls}>Estilos secundarios</label>
              <div className="mt-3 space-y-3">
                {DANCE_STYLE_GROUPS.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.styles.map((style) => {
                        const active = estilosSecundarios.includes(style.value)
                        return (
                          <button
                            key={style.value}
                            type="button"
                            onClick={() => toggleEstiloSecundario(style.value)}
                            className={`border rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
                              active
                                ? "bg-sky-500 text-white border-sky-500"
                                : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500"
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
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <label className={labelCls}>Tipos de clase que ofreces</label>
              <div className="flex flex-col gap-2 mt-2">
                {TIPOS_CLASE_OPTIONS.map((tipo) => (
                  <label key={tipo} className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={tiposClase.includes(tipo)}
                      onChange={() => toggleTipoClase(tipo)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <label className={labelCls}>Niveles que enseñas</label>
              <div className="flex flex-col gap-2 mt-2">
                {NIVEL_OPTIONS.map((nivel) => (
                  <label key={nivel} className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={niveles.includes(nivel)}
                      onChange={() => toggleNivel(nivel)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4">
              <label className={labelCls}>Horarios disponibles</label>
              <textarea
                value={horarios}
                onChange={(e) => setHorarios(e.target.value)}
                rows={3}
                placeholder="Ej: Lunes y miércoles 6–8 pm, sábados mañana"
                className={`${inputCls} mt-1`}
              />
            </div>
          </div>
        </div>
      )}

      {!isAdmin && !hasChanges && !sent && (
        <p className="text-sm text-zinc-500 mt-2">
          No has realizado ningún cambio.
        </p>
      )}

      {formError && (
        <p className="text-sm text-red-400 mt-2">
          {formError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="w-full bg-primary text-white font-heading text-xl tracking-wide py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40 mt-6"
      >
        {loading
          ? (isAdmin ? "Guardando..." : "Enviando...")
          : (!isAdmin && sent)
            ? "Enviado"
            : (isAdmin ? "Guardar cambios" : "Enviar cambios para revisión")}
      </button>
    </div>
  )
}
