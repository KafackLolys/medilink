"use client";
import { AuthShell, GoogleButton, OrDivider } from "@/components/custum/auth-shell";
import { Button } from "@/components/custum/button";
import { PasswordField, TextField } from "@/components/custum/field";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Entrez une adresse e-mail valide.";
    if (password.length < 8) next.password = "Le mot de passe contient au moins 8 caractères.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // TODO : POST `${process.env.NEXT_PUBLIC_API_URL}/auth/login` (NestJS) puis redirection selon le rôle
      await new Promise((r) => setTimeout(r, 900));
      router.push("/patient");
    } catch {
      setErrors({ form: "Connexion impossible. Vérifiez vos identifiants et réessayez." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-3xl font-extrabold tracking-tight text-night">Bon retour parmi nous</h1>
      <p className="mt-2 text-base text-muted">Connectez-vous pour retrouver vos rendez-vous et vos demandes.</p>

      <div className="mt-8"><GoogleButton label="Continuer avec Google" /></div>
      <OrDivider>ou avec votre e-mail</OrDivider>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {errors.form && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{errors.form}</p>
        )}
        <TextField label="Adresse e-mail" type="email" autoComplete="email" icon={<Mail />}
          placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField label="Mot de passe" autoComplete="current-password" icon={<Lock />}
          placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 font-medium">
            <input type="checkbox" className="size-5 rounded border-slate-300 accent-primary" /> Rester connecté
          </label>
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">Mot de passe oublié ?</Link>
        </div>

        <Button type="submit" loading={loading}>Se connecter</Button>
      </form>

      <p className="mt-8 text-center text-base text-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">Créer un compte</Link>
      </p>
    </AuthShell>
  );
}
