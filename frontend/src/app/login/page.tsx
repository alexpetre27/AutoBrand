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
    <main className="min-h-screen bg-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm p-8 rounded-2xl border border-slate-700/50 bg-slate-900/40 shadow-2xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-white mb-6 text-center tracking-wide">
          Autentificare
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
              Utilizator
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-950 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
              Parolă
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-rose-500 text-xs mt-2 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-lg mt-4"
          >
            Conectare
          </button>
        </form>
      </div>
    </main>
  );
}
