"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Date de autentificare incorecte.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-black/5 rounded-[32px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        <div className="mb-8">
          <p className="text-sm text-neutral-500 mb-2">Bun venit înapoi</p>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Autentificare
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Utilizator
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Parolă
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:bg-white"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 pt-1">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-all"
          >
            Conectare
          </button>
        </form>
      </div>
    </main>
  );
}
