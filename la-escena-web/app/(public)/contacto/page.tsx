import ContactForm from '@/components/ContactForm'
import styles from '@/styles/contact.module.css'

export default function ContactoPage() {
  return (
    <section className={styles.container}>
      <h1>Contacto</h1>
      <ContactForm />
    </section>
  )
}
