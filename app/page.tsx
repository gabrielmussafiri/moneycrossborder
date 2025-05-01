import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Cross-Border Transfer</h1>
          <p className="text-muted-foreground mt-2">Secure platform for cross-border money transfers</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
