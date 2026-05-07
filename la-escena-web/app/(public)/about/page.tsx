'use client'

import { motion } from "framer-motion";
import { User } from "lucide-react";

const team = [
  {
    name: "Sara",
    role: "Directora General",
    bio: "Fundadora de La Escena. Apasionada por formalizar la industria del baile en Colombia.",
  },
  {
    name: "Equipo Creativo",
    role: "Dirección Artística",
    bio: "Profesionales dedicados a curar el mejor talento para cada proyecto.",
  },
  {
    name: "Producción",
    role: "Coordinación",
    bio: "Gestión de eventos, castings y logística para garantizar la excelencia.",
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

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Sobre <span className="text-secondary">Nosotros</span>
          </h1>
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="py-20 bg-background">
        <div className="container max-w-3xl text-center space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            La Escena S.A.S. promueve, comercializa y produce servicios de artes escénicas,
            especialmente danza. Somos una agencia de bailarines y creemos en la formalidad
            como motor de crecimiento para la industria del entretenimiento en Colombia.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Conectamos marcas, productores y organizadores de eventos con talento artístico
            profesional y verificado. Nuestro catálogo cuenta con más de 200 artistas.
          </motion.p>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center p-8 bg-card rounded-lg border border-border space-y-3"
              >
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <User size={40} className="text-accent" />
                </div>
                <h3 className="font-heading text-xl tracking-wide">{member.name}</h3>
                <p className="text-sm text-accent font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
