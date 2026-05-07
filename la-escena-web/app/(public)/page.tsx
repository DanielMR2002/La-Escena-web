'use client'

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Sparkles, Music, Camera, Star, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const services = [
  { icon: Users, label: "Agencia de Bailarines", desc: "Talento curado para tus eventos y producciones" },
  { icon: Sparkles, label: "Casting & Curaduría", desc: "Selección profesional del talento ideal" },
  { icon: Music, label: "Shows & Performance", desc: "Espectáculos memorables para cualquier formato" },
  { icon: Camera, label: "Book & Contenido", desc: "Fotografía y video profesional para artistas" },
  { icon: Star, label: "Clases de Baile", desc: "Formación personalizada en múltiples estilos" },
];

const differentiators = [
  "Agencia registrada legalmente (S.A.S.)",
  "Procesos claros y contratos formales",
  "Talento local verificado y profesional",
  "Más de 200 artistas en nuestro catálogo",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-foreground overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-dance.JPG"
            alt="Bailarines La Escena"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-secondary/30 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-widest text-secondary">
                Agencia de Talento Artístico
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-wide text-primary-foreground"
            >
              Llevamos tu evento
              <br />
              al <span className="text-gradient">siguiente nivel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-primary-foreground/60 max-w-xl leading-relaxed"
            >
              Conectamos marcas y productores con bailarines y artistas de alto
              talento para eventos, producciones audiovisuales y experiencias únicas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
              >
                Contáctanos <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Qué Hacemos */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest text-accent"
            >
              Nuestros Servicios
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl sm:text-6xl mt-3 tracking-wide"
            >
              Qué Hacemos
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <service.icon size={24} />
                </div>
                <h3 className="font-heading text-xl tracking-wide mb-2">{service.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valor Diferencial */}
      <section className="py-24 bg-foreground">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="text-sm font-semibold uppercase tracking-widest text-secondary"
              >
                Por qué elegirnos
              </motion.span>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-heading text-5xl sm:text-6xl tracking-wide text-primary-foreground leading-[1.1]"
              >
                Formalidad, talento y confianza
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-primary-foreground/60 leading-relaxed"
              >
                La Escena S.A.S. es la primera agencia registrada de bailarines en Colombia.
                Creemos en la formalidad como motor de crecimiento para la industria del entretenimiento.
              </motion.p>
              <motion.ul variants={fadeUp} custom={3} className="space-y-4">
                {differentiators.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-primary-foreground/80">
                    <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="/talent-showcase.PNG"
                  alt="Talento La Escena"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-3xl text-secondary-foreground">200+</div>
                  <div className="text-xs text-secondary-foreground/70 uppercase">Artistas</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container relative z-10 text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground"
          >
            Cuéntanos tu proyecto
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/70 max-w-xl mx-auto"
          >
            Desde shows corporativos hasta producciones audiovisuales, tenemos el talento perfecto para ti.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-10 py-5 bg-secondary text-secondary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary/90 transition-all hover:gap-3"
            >
              Contáctanos <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
