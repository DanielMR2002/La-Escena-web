'use client'

import { motion } from "framer-motion";
import { Video, Film, Smartphone, MessageCircle } from "lucide-react";

const servicios = [
  {
    icon: Smartphone,
    title: "Reels & TikToks",
    desc: "Contenido viral con coreografías y talento profesional para tus redes sociales.",
  },
  {
    icon: Film,
    title: "Kits de Contenido",
    desc: "Paquetes completos de videos y fotos para campañas digitales.",
  },
  {
    icon: Video,
    title: "Cobertura de Eventos",
    desc: "Registro audiovisual profesional de tus eventos y producciones.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ContenidoPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Creación de <span className="text-secondary">Contenido</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Servicios de producción audiovisual: reels, kits de contenido y cobertura de eventos.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {servicios.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <s.icon size={28} />
                </div>
                <h3 className="font-heading text-2xl tracking-wide mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="py-20 bg-muted">
        <div className="container max-w-2xl text-center space-y-6">
          <h2 className="font-heading text-4xl tracking-wide">¿Necesitas contenido?</h2>
          <p className="text-muted-foreground">
            Contáctanos por WhatsApp y cotiza tu proyecto de contenido audiovisual.
          </p>
          <a
            href="https://wa.me/573106823504?text=Hola%2C%20quiero%20cotizar%20creaci%C3%B3n%20de%20contenido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={20} />
            Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
