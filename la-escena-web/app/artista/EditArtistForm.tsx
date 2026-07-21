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
} from "@/lib/artistProfileOptions"

type TrayectoriaItem = { proyecto: string; cliente: string; anio: string }

type ArtistFormState = {
  name: string
  city: string
  category: string
  experience: string
  projectTypes: string
  experienceDescription: string
  featuredProjects: string
  description: string
  age: string
  height: string
  cvUrl: string
  complexion: string
  eyeColor: string
  hairType: string
  hairLength: string
  hairColor: string
  agencyProfile: string
}

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
  initialData,
  lastRejectedRevision,
}: {
  artistId: string
  sanityId?: string | null
  isAdmin?: boolean
  esProfesor?: boolean
  hasPendingMedia?: boolean
  initialData: any
  lastRejectedRevision: any
}) {
  const [form, setForm] = useState<ArtistFormState>({
    name:        initialData?.name        ?? "",
    city:        initialData?.city        ?? "",
    category:    initialData?.category    ?? "",
    experience:  String(initialData?.experience  ?? ""),
    projectTypes: initialData?.projectTypes ?? "",
    experienceDescription: initialData?.experienceDescription ?? "",
    featuredProjects: initialData?.featuredProjects ?? "",
    description: initialData?.description ?? "",
    age:         String(initialData?.age   ?? ""),
    height:      String(initialData?.height ?? ""),
    cvUrl:       initialData?.cvUrl        ?? "",
    complexion:  initialData?.complexion  ?? "",
    eyeColor:    initialData?.eyeColor    ?? "",
    hairType:    initialData?.hairType    ?? "",
    hairLength:  initialData?.hairLength  ?? "",
    hairColor:   initialData?.hairColor   ?? "",
    agencyProfile: initialData?.agencyProfile ?? "",
  })

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

  const [trayectoria, setTrayectoria] = useState<TrayectoriaItem[]>(
    Array.isArray(initialData?.trayectoria)
      ? initialData.trayectoria.map((t: any) => ({
          proyecto: t.proyecto ?? "",
          cliente:  t.cliente  ?? "",
          anio:     String(t.anio ?? ""),
        }))
      : []
  )

  const [showComment, setShowComment] = useState(true)
  const [loading, setLoading]         = useState(false)
  const [sent, setSent]               = useState(false)

  const [cvUploading, setCvUploading]   = useState(false)
  const [cvUploadError, setCvUploadError] = useState<string | null>(null)
  const [cvFileName, setCvFileName]     = useState<string | null>(null)

  const heightNum = form.height ? parseInt(form.height) : null
  const heightError = heightNum !== null && !isNaN(heightNum) && (heightNum < 100 || heightNum > 250)
    ? "La estatura debe estar entre 100 y 250 cm"
    : null

  const initialSnapshot = useMemo(() => JSON.stringify({
    form: {
      name:        initialData?.name        ?? "",
      city:        initialData?.city        ?? "",
      category:    initialData?.category    ?? "",
      experience:  String(initialData?.experience  ?? ""),
      projectTypes: initialData?.projectTypes ?? "",
      experienceDescription: initialData?.experienceDescription ?? "",
      featuredProjects: initialData?.featuredProjects ?? "",
      description: initialData?.description ?? "",
      age:         String(initialData?.age   ?? ""),
      height:      String(initialData?.height ?? ""),
      cvUrl:       initialData?.cvUrl        ?? "",
      complexion:  initialData?.complexion  ?? "",
      eyeColor:    initialData?.eyeColor    ?? "",
      hairType:    initialData?.hairType    ?? "",
      hairLength:  initialData?.hairLength  ?? "",
      hairColor:   initialData?.hairColor   ?? "",
      agencyProfile: initialData?.agencyProfile ?? "",
    },
    availability: initialData?.artistAvailability ?? true,
    hashtagsInput: Array.isArray(initialData?.hashtags)
      ? initialData.hashtags.join(", ")
      : (initialData?.hashtags ?? ""),
    trayectoria: Array.isArray(initialData?.trayectoria)
      ? initialData.trayectoria.map((t: any) => ({
          proyecto: t.proyecto ?? "",
          cliente:  t.cliente  ?? "",
          anio:     String(t.anio ?? ""),
        }))
      : [],
    selectedSkills: initialSkills.preset,
    customSkillsInput: initialSkills.customInput,
    tiposClase: Array.isArray(initialData?.tiposClase) ? initialData.tiposClase : [],
    selectedStyles: Array.isArray(initialData?.styles) ? initialData.styles : [],
  }), [initialData]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasChanges = JSON.stringify({
    form, availability, hashtagsInput, trayectoria, selectedSkills, customSkillsInput,
    tiposClase, selectedStyles,
  }) !== initialSnapshot

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

  function setTrayField(i: number, field: keyof TrayectoriaItem, value: string) {
    setTrayectoria((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmit = async () => {
    if (heightError) return
    setLoading(true)

    const data = {
      ...form,
      experience:  form.experience  ? parseInt(form.experience)  : undefined,
      age:         form.age         ? parseInt(form.age)         : undefined,
      height:      form.height      ? parseInt(form.height)      : undefined,
      hashtags:    hashtagsInput.split(",").map((h) => h.trim()).filter(Boolean),
      skills: [
        ...selectedSkills,
        ...customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      ],
      tiposClase,
      styles: selectedStyles,
      ...(hasPendingMedia ? { hasPendingMedia: true } : {}),
      artistAvailability: availability,
      trayectoria: trayectoria.map((t) => ({
        _key:     Math.random().toString(36).slice(2, 10),
        proyecto: t.proyecto,
        cliente:  t.cliente,
        anio:     t.anio ? parseInt(t.anio) : undefined,
      })),
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
  }

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", marginTop: "4px",
    padding: "8px 10px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box",
  }

  return (
    <div style={{ marginTop: "30px" }}>

      {lastRejectedRevision && (
        <div style={{
          background: "#ffe5e5", padding: "15px", borderRadius: "8px",
          marginBottom: "20px", border: "1px solid #ffb3b3",
        }}>
          <button onClick={() => setShowComment(!showComment)} style={{ marginBottom: "10px", cursor: "pointer" }}>
            {showComment ? "Ocultar comentario" : "Mostrar comentario"}
          </button>
          {showComment && (
            <>
              <strong>Tu última revisión fue rechazada:</strong>
              <p style={{ marginTop: "8px" }}>{lastRejectedRevision.adminComment}</p>
            </>
          )}
        </div>
      )}

      {sent && (
        isAdmin ? (
          <p style={{ color: "green", marginBottom: "16px" }}>
            Perfil actualizado correctamente.
          </p>
        ) : (
          <div style={{ color: "#15803d", marginBottom: "16px", lineHeight: 1.6 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>
              ¡Tu información fue actualizada correctamente!
            </p>
            <p style={{ margin: "8px 0 0" }}>
              Tu perfil será revisado por nuestro equipo y próximamente recibirás una notificación confirmando si la nueva información fue aprobada y actualizada dentro de la agencia.
            </p>
            <p style={{ margin: "8px 0 0" }}>
              Gracias por mantener tu perfil actualizado y seguir creciendo junto a LA ESCENA.
            </p>
          </div>
        )
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        <div>
          <label>Nombre artístico</label>
          <input value={form.name} onChange={set("name")} style={inputStyle} />
        </div>

        <div style={{ padding: "14px", background: "#fff7f8", border: "1px solid #ffd6dd", borderRadius: "8px" }}>
          <label style={{ fontWeight: 600 }}>¿Cómo te gustaría ser representado?</label>
          <select value={form.agencyProfile} onChange={set("agencyProfile")} style={inputStyle}>
            <option value="">Selecciona una opción</option>
            {AGENCY_PROFILE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label>Ciudad</label>
          <input value={form.city} onChange={set("city")} style={inputStyle} />
        </div>

        <div>
          <label>¿Quién eres como artista y persona?</label>
          <textarea value={form.description} onChange={set("description")} rows={4} style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <div>
            <label>Experiencia (años)</label>
            <input type="number" min={0} value={form.experience} onChange={set("experience")} style={inputStyle} />
          </div>
          <div>
            <label>Edad</label>
            <input type="number" min={0} value={form.age} onChange={set("age")} style={inputStyle} />
          </div>
          <div>
            <label>Estatura (cm)</label>
            <input type="number" min={100} max={250} value={form.height} onChange={set("height")} style={inputStyle} />
            {heightError && (
              <p style={{ marginTop: "4px", fontSize: "0.78rem", color: "#dc2626" }}>{heightError}</p>
            )}
          </div>
        </div>

        <div>
          <label>¿En qué tipo de proyectos has trabajado?</label>
          <textarea value={form.projectTypes} onChange={set("projectTypes")} rows={4} style={inputStyle} />
        </div>

        <div>
          <label>¿Qué experiencia tienes?</label>
          <textarea value={form.experienceDescription} onChange={set("experienceDescription")} rows={4} style={inputStyle} />
        </div>

        <div>
          <label>Proyectos destacados</label>
          <textarea
            value={form.featuredProjects}
            onChange={set("featuredProjects")}
            rows={4}
            placeholder="Menciona tus proyectos más importantes..."
            style={inputStyle}
          />
        </div>

        <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "16px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600 }}>
            Características físicas
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label>Complexión</label>
              <select value={form.complexion} onChange={set("complexion")} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                {COMPLEXION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label>Color de ojos</label>
              <select value={form.eyeColor} onChange={set("eyeColor")} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                {EYE_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label>Tipo de cabello</label>
              <select value={form.hairType} onChange={set("hairType")} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                {HAIR_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label>Largo del cabello</label>
              <select value={form.hairLength} onChange={set("hairLength")} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                {HAIR_LENGTH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label>Color de cabello</label>
              <select value={form.hairColor} onChange={set("hairColor")} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                {HAIR_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "16px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600 }}>
            Habilidades
          </label>

          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SKILL_OPTIONS.map((skill) => {
                const active = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: "6px 14px", fontSize: "0.82rem", borderRadius: "999px",
                      cursor: "pointer",
                      border: active ? "1px solid #e5173f" : "1px solid #d1d5db",
                      background: active ? "#e5173f" : "white",
                      color: active ? "white" : "#374151",
                    }}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>Otras habilidades (separadas por coma)</label>
              <input
                value={customSkillsInput}
                onChange={(e) => setCustomSkillsInput(e.target.value)}
                placeholder="Otras habilidades no listadas arriba"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {esProfesor && (
          <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "16px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: 600 }}>
              Como profesor
            </label>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Tipos de clase que ofreces</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {TIPOS_CLASE_OPTIONS.map((tipo) => (
                  <label key={tipo} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={tiposClase.includes(tipo)}
                      onChange={() => toggleTipoClase(tipo)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Estilos que enseñas</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {STYLE_OPTIONS.map((style) => {
                  const active = selectedStyles.includes(style)
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      style={{
                        padding: "6px 14px", fontSize: "0.82rem", borderRadius: "999px",
                        cursor: "pointer",
                        border: active ? "1px solid #e5173f" : "1px solid #d1d5db",
                        background: active ? "#e5173f" : "white",
                        color: active ? "white" : "#374151",
                      }}
                    >
                      {style}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={availability}
              onChange={(e) => setAvailability(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <span>Disponible para proyectos</span>
          </label>
        </div>

        <div>
          <label>Hashtags (separados por coma)</label>
          <input
            value={hashtagsInput}
            onChange={(e) => setHashtagsInput(e.target.value)}
            placeholder="#rubios, #acrobacias, #contemporáneo"
            style={inputStyle}
          />
          <small style={{ color: "#6b7280", marginTop: "4px", display: "block" }}>
            Escribe las etiquetas separadas por coma.
          </small>
        </div>

        <div>
          <label>CV (enlace PDF)</label>
          <input type="url" value={form.cvUrl} onChange={set("cvUrl")} placeholder="https://..." style={inputStyle} />
          {form.cvUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
              <a href={form.cvUrl} target="_blank" rel="noopener noreferrer"
                 style={{ fontSize: "0.8rem", color: "#6b7280", textDecoration: "underline" }}>
                Ver CV actual →
              </a>
              <button
                type="button"
                onClick={() => { setForm((prev) => ({ ...prev, cvUrl: "" })); setCvFileName(null) }}
                style={{ fontSize: "0.8rem", color: "#dc2626", cursor: "pointer", background: "none", border: "none", padding: 0 }}
              >
                × Eliminar CV
              </button>
            </div>
          )}
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #e5e7eb" }}>
            <label style={{ fontSize: "0.85rem", color: "#374151", display: "block", marginBottom: "6px" }}>
              O sube un PDF directamente
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleCvUpload}
              disabled={cvUploading}
              style={{ fontSize: "0.85rem" }}
            />
            {cvUploading && (
              <p style={{ marginTop: "6px", fontSize: "0.8rem", color: "#6b7280" }}>Subiendo...</p>
            )}
            {cvFileName && !cvUploading && (
              <p style={{ marginTop: "6px", fontSize: "0.8rem", color: "#16a34a" }}>✓ {cvFileName}</p>
            )}
            {cvUploadError && (
              <p style={{ marginTop: "6px", fontSize: "0.8rem", color: "#dc2626" }}>{cvUploadError}</p>
            )}
            <small style={{ display: "block", marginTop: "4px", color: "#9ca3af" }}>
              Solo PDF · máx. 10 MB
            </small>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Trayectoria</label>
          {trayectoria.map((item, i) => (
            <div key={i} style={{
              border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "12px", marginBottom: "8px", background: "#f9fafb",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#6b7280" }}>Proyecto</label>
                  <input value={item.proyecto} onChange={(e) => setTrayField(i, "proyecto", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#6b7280" }}>Cliente</label>
                  <input value={item.cliente} onChange={(e) => setTrayField(i, "cliente", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#6b7280" }}>Año</label>
                  <input type="number" min={1990} max={2099} value={item.anio} onChange={(e) => setTrayField(i, "anio", e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button
                onClick={() => setTrayectoria((prev) => prev.filter((_, idx) => idx !== i))}
                style={{ marginTop: "8px", fontSize: "0.8rem", color: "#ef4444", cursor: "pointer", background: "none", border: "none", padding: 0 }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            onClick={() => setTrayectoria((prev) => [...prev, { proyecto: "", cliente: "", anio: "" }])}
            style={{
              marginTop: "4px", padding: "6px 12px", fontSize: "0.85rem",
              border: "1px dashed #9ca3af", borderRadius: "6px",
              cursor: "pointer", background: "none", color: "#374151",
            }}
          >
            + Agregar proyecto
          </button>
        </div>
      </div>

      {!isAdmin && !hasChanges && !sent && (
        <p style={{ marginTop: "16px", fontSize: "0.85rem", color: "#6b7280" }}>
          No has realizado ningún cambio.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !!heightError || (!isAdmin && sent) || (!isAdmin && !hasChanges)}
        style={{
          marginTop: "24px", padding: "10px 20px",
          background: "#e5173f", color: "white",
          border: "none", borderRadius: "8px",
          cursor: "pointer", fontWeight: "600",
          opacity: (loading || heightError || (!isAdmin && sent) || (!isAdmin && !hasChanges)) ? 0.6 : 1,
        }}
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
