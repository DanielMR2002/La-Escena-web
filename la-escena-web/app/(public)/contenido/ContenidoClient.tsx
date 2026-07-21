'use client'

import { motion } from "framer-motion";
import { Video, Film, Smartphone, TrendingUp, MessageCircle } from "lucide-react";

const servicios = [
  {
    icon: Smartphone,
    title: "Reels & TikToks",
    desc: "Contenido dinámico y de alto impacto para redes sociales. Creamos reels y TikToks con coreografías, conceptos creativos y talento profesional para aumentar el alcance y la conexión de tu marca con su audiencia.",
  },
  {
    icon: Film,
    title: "Kits de Contenido",
    desc: "Paquetes completos de fotografía y video para fortalecer tu presencia digital. Incluye la creación de contenido pensado para campañas, redes sociales y plataformas digitales, acompañado de una estrategia de marketing para maximizar su impacto.",
  },
  {
    icon: Video,
    title: "Cobertura de Eventos",
    desc: "Registro audiovisual profesional para eventos, lanzamientos, activaciones, shows y producciones. Capturamos los mejores momentos para convertirlos en contenido de alto valor.",
  },
  {
    icon: TrendingUp,
    title: "Trends para Campañas",
    desc: "Diseñamos y producimos trends para TikTok e Instagram junto a bailarines y creadores de contenido. Creamos campañas que integran la danza, el movimiento y la creatividad para potenciar el alcance y la recordación de tu marca.",
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

export default function ContenidoClient() {
  return (
    <>
      {/* DESCRIPCIÓN */}
      <section className="pt-20 bg-background">
        <div className="container max-w-2xl text-center">
          <p className="text-muted-foreground leading-relaxed">
            Desarrollamos producciones pensadas para redes sociales,
            campañas publicitarias y proyectos de marca, combinando dirección creativa,
            estrategia y ejecución audiovisual.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid sm:grid-cols-2 gap-8">
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
            Cuéntanos tu proyecto y te ayudaremos a crear una propuesta audiovisual
            adaptada a tus objetivos.
          </p>
          <a
            href="https://wa.me/573106823504?text=Hola%2C%20quiero%20cotizar%20creaci%C3%B3n%20de%20contenido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={20} />
            Cotizar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
