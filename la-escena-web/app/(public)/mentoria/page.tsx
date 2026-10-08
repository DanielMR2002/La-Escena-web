import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import CourseCard from './CourseCard'

export const metadata: Metadata = {
  title: 'Mentoría & Formación',
  description:
    'Cursos y mentorías para profesionalizar tu carrera artística: aspectos legales, castings, plan de acción y desarrollo profesional. La Escena, Colombia.',
}

// TODO: agregar imágenes en public/images/courses/ (legal-lab.jpg, proyecta-carrera.jpg, stage-system.jpg)
const courses = [
  {
    title: "LEGAL LAB — Contratos, Imagen y Derechos",
    description: "Formación enfocada en los aspectos legales que todo artista debe conocer para proteger su trabajo, su imagen y sus derechos.",
    hotmartUrl: "https://hotmart.com/es/marketplace/productos/legal-lab-contratos-imagen-y-derechos/L106185231A?sck=HOTMART_PRODUCT_PAGE",
    buttonLabel: "Ver curso / Comprar",
    image: "/images/courses/legal-lab.jpg",
  },
  {
    title: "Proyecta tu Carrera Artística",
    description: "Presentación de Castings y Plan de Acción para Bailarines. Herramientas para presentar tus castings de manera profesional y construir un plan de acción para avanzar en tu carrera artística.",
    hotmartUrl: "https://hotmart.com/es/marketplace/productos/proyecta-tu-carrera-artistica-castings-y-plan-de-accion-para-bailarines/T106051462A",
    buttonLabel: "Ver curso / Comprar",
    image: "/images/courses/proyecta-carrera.jpg",
  },
  {
    title: "SS STAGE SYSTEM",
    description: "Sistema de formación para artistas enfocado en fortalecer y profesionalizar su carrera dentro de la industria.",
    hotmartUrl: "https://stagesystem.hotmart.host/nueva-pagina-ab922e66-efdd-4ea9-8990-c301ef141d8e",
    buttonLabel: "Ver curso / Comprar",
    image: "/images/courses/stage-system.jpg",
  },
]

export default function MentoriaPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            MENTORÍA PARA <span className="text-secondary">ARTISTAS</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Cursos y mentorías para profesionalizar tu danza y generar más oportunidades dentro de
            la industria.
          </p>
        </div>
      </section>

      {/* CURSOS */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
            Nuestros Cursos
          </h2>
          {/* TODO: agregar imágenes en public/images/courses/ */}
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* MENTORÍA PERSONALIZADA */}
      <section className="py-24 bg-muted">
        <div className="container text-center space-y-6 max-w-2xl mx-auto">
          <GraduationCap size={40} className="text-accent mx-auto" />
          <h2 className="font-heading text-4xl sm:text-5xl tracking-wide text-foreground">
            ¿Quieres una mentoría 1 a 1 diseñada para tu momento artístico?
          </h2>
          <Link
            href="/contacto?servicio=Mentoría+personalizada"
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
          >
            Quiero una mentoría personalizada con La Escena <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
