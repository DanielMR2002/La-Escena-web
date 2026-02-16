"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"


export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

    const res = await signIn("credentials", {
    email,
    password,
    redirect: false
    })

    if (!res?.error) {
      const session = await getSession()

      if (session?.user.role === "ADMIN") {
        router.push("/admin")
      } else if (session?.user.role === "CLIENT") {
        router.push("/cliente")
      } else {
        router.push("/")
      }
    } else {
      alert("Credenciales incorrectas")
    }
  }


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
