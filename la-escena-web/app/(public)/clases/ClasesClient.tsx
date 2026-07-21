'use client'

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Music, User, MapPin, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { STYLE_OPTIONS } from "@/lib/artistProfileOptions";

const estilos = STYLE_OPTIONS;

type Teacher = {
  _id: string;
  name: string;
  slug?: { current: string };
  city?: string;
  category?: string;
  styles?: string[];
  tiposClase?: string[];
  photos?: any[];
};

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

export default function ClasesClient({ teachers }: { teachers: Teacher[] }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const cities = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => { if (t.city) set.add(t.city); });
    return Array.from(set).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      if (city && t.city !== city) return false;
      if (search.trim() && !t.name?.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [teachers, search, city]);

  return (
    <>
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

          <div className="flex flex-wrap gap-4 mb-10 max-w-2xl mx-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las ciudades</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {filteredTeachers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No se encontraron profesores con esos filtros.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link
                    href={`/artistas/${t.slug?.current ?? ""}`}
                    className="block bg-card rounded-lg border border-border p-6 space-y-4 hover:shadow-lg transition-shadow"
                  >
                    {t.photos?.[0] ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto relative">
                        <Image
                          src={urlFor(t.photos[0]).width(160).height(160).fit("crop").url()}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                        <User size={32} className="text-accent" />
                      </div>
                    )}
                    <h3 className="font-heading text-xl tracking-wide text-center">
                      {t.name}
                    </h3>
                    {t.city && (
                      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={14} /> {t.city}
                      </div>
                    )}
                    {Array.isArray(t.styles) && t.styles.length > 0 && (
                      <div className="text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {t.styles.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {Array.isArray(t.tiposClase) && t.tiposClase.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 pt-1">
                        {t.tiposClase.map((tipo) => (
                          <span key={tipo} className="px-3 py-1 text-xs bg-secondary/15 text-secondary font-medium border border-secondary/40 rounded-full">
                            {tipo}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="py-20 bg-background">
        <div className="container max-w-2xl text-center space-y-6">
          <h2 className="font-heading text-4xl tracking-wide">
            ¿Quieres bailar con nosotros?
          </h2>
          <p className="text-muted-foreground">
            Escríbenos por WhatsApp y agenda la opción que mejor se adapte a tus
            objetivos y disponibilidad.
          </p>
          <a
            href={`https://wa.me/573106823504?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={20} />
            Agendar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
