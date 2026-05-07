'use client'

import { motion } from "framer-motion";
import { Music, User, MapPin, MessageCircle } from "lucide-react";

const estilos = [
  "Salsa",
  "Bachata",
  "Merengue",
  "Dancehall",
  "Hip-Hop",
  "House",
  "Breaking",
  "Contemporáneo",
];

const profes = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Profesor ${i + 1}`,
  styles: [estilos[i % estilos.length], estilos[(i + 3) % estilos.length]],
  city: ["Bogotá", "Medellín", "Cali"][i % 3],
}));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const whatsappMessage = encodeURIComponent(
  "Hola, estoy interesado en las clases de baile de La Escena."
);

export default function ClasesPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Clases de <span className="text-secondary">Baile</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Personalizadas o grupales. Estilos: salsa, bachata, merengue,
            dancehall, hip-hop, house, breaking, contemporáneo…
          </p>
        </div>
      </section>

      {/* ESTILOS DISPONIBLES */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-10">
            Estilos Disponibles
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {estilos.map((e, i) => (
              <motion.div
                key={e}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full"
              >
                <Music size={16} className="text-accent" />
                <span className="text-sm font-medium">{e}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFESORES */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-10">
            Nuestros Profesores
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profes.map((p, i) => (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-lg border border-border p-6 space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <User size={32} className="text-accent" />
                </div>
                <h3 className="font-heading text-xl tracking-wide text-center">
                  {p.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} /> {p.city}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {p.styles.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="py-20 bg-background">
        <div className="container max-w-2xl text-center space-y-6">
          <h2 className="font-heading text-4xl tracking-wide">
            ¿Quieres una clase?
          </h2>
          <p className="text-muted-foreground">
            Escríbenos por WhatsApp y agenda tu clase personalizada o grupal.
          </p>
          <a
            href={`https://wa.me/573106823504?text=${whatsappMessage}`}
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
