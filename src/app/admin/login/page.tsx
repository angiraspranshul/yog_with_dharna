"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/admin/login", { password });
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      setError(
        err.response?.data?.error || "Invalid password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="w-full max-w-md glass-effect border border-border p-8 sm:p-10 rounded-3xl shadow-xl animate-fade-in-up">
          <div className="text-center flex flex-col gap-3 mb-8">
            <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-white font-serif font-bold text-lg mx-auto shadow-sm">
              ॐ
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Admin Portal
            </h1>
            <p className="text-muted text-xs sm:text-sm max-w-xs mx-auto">
              Please authenticate to access booking dashboards, calendars, and class scheduling settings.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 text-center text-xs font-semibold text-rose-500 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-medium text-stone-700 dark:text-stone-300">
                Dashboard Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-gold text-stone-950 dark:text-stone-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl gold-gradient-bg text-white hover:shadow-lg transition-all duration-300 font-semibold transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 shadow-md mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0"></span>
                  Authenticating...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>
          
          <div className="text-[10px] text-center text-muted/50 mt-6 italic">
            🔑 Set ADMIN_PASSWORD in your .env file to configure this gateway.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
