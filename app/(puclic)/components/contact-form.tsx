"use client";

import { SITE } from "@/lib/site";
import { useState, type FormEvent } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100";

export default function ContactForm() {
  const [opened, setOpened] = useState(false);

  /**
   * Version sans backend : ouvre le client mail de l'utilisateur.
   * Pour envoyer depuis l'API, remplacez ce handler par un
   * fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, { method: "POST", ... }).
   */
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name"));
    const email = String(data.get("email"));
    const subject = String(data.get("subject"));
    const message = String(data.get("message"));

    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="text-sm font-medium">
          Sujet
        </label>
        <select id="subject" name="subject" required className={inputClass}>
          <option value="Question sur mon compte">Question sur mon compte</option>
          <option value="Problème technique">Problème technique</option>
          <option value="Question sur mes données">
            Question sur mes données personnelles
          </option>
          <option value="Autre demande">Autre demande</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          N’indiquez pas d’informations médicales détaillées dans ce message.
        </p>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400"
      >
        Envoyer le message
      </button>

      {opened && (
        <p role="status" className="text-sm text-stone-600 dark:text-stone-400">
          Votre application de messagerie s’est ouverte. Si ce n’est pas le cas,
          écrivez-nous directement à {SITE.email}.
        </p>
      )}
    </form>
  );
}