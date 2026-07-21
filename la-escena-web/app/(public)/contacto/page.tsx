import type { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import ContactForm from '@/app/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para castings, eventos, clases de baile o producción de contenido. La Escena, agencia de artistas en Colombia.',
}

export default function ContactoPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            <span className="text-secondary">Contáctanos</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            ¿Tienes un proyecto en mente? Cuéntanos y te responderemos en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* FORMULARIO + PANEL LATERAL */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-16">

            {/* FORMULARIO */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-3xl tracking-wide mb-8">
                Envíanos un mensaje
              </h2>
              <ContactForm />
            </div>

            {/* PANEL LATERAL */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 bg-card rounded-lg border border-border space-y-6">
                <h3 className="font-heading text-xl tracking-wide">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">info@laescena.co</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                      <p className="text-sm font-medium">+57 310 682 3504</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                      <p className="text-sm font-medium">Colombia</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/573106823504"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={24} />
                <div>
                  <p className="font-semibold text-sm">¿Prefieres WhatsApp?</p>
                  <p className="text-xs text-white/80">Escríbenos directamente</p>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
