import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "amu3sr0m",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "sktfdz5oj6h7FLTiISWCBRr8WGtQH2AnSlCJjuQN1iG65Fm7MjSXN6OYA6Dj5uakM3LIBdfZMpMBWbtFr",
  useCdn: false,
})

const result = await client.fetch(
  `*[_type == "artist"]{ _id, name, pruebasTrabajo, pruebasTrabajoAprobadas }`
)

for (const r of result) {
  const p = r.pruebasTrabajo
  const a = r.pruebasTrabajoAprobadas
  if (p?.length || a?.length) {
    console.log("=====", r.name, r._id)
    console.log("pruebasTrabajo:", JSON.stringify(p, null, 2))
    console.log("pruebasTrabajoAprobadas:", JSON.stringify(a, null, 2))
  }
}
console.log("Done - artistas con pruebas:", result.filter(r => r.pruebasTrabajo?.length || r.pruebasTrabajoAprobadas?.length).length)
