"use client";
import {useState,type FormEvent} from "react";
import {integrationService} from "@/services/integration-service";

export function ContactForm() {
  const [name,setName]=useState("");const [email,setEmail]=useState("");
  const [subject,setSubject]=useState("");const [message,setMessage]=useState("");
  const [honeypot,setHoneypot]=useState("");const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);const [error,setError]=useState<string|null>(null);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError(null);setSuccess(false);
    if(honeypot){setLoading(false);return}
    try{await integrationService.sendContact({name:name.trim(),email:email.trim(),subject:subject.trim(),message:message.trim()});setSuccess(true);setMessage("");setSubject("")}
    catch(cause){setError(cause instanceof Error?cause.message:"Échec de l'envoi du message.")}finally{setLoading(false)}
  }
  return <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Votre message a été enregistré. Notre équipe pourra le consulter.</p>}
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <label className="block text-sm font-bold">Nom<input required minLength={2} maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
    <label className="block text-sm font-bold">E-mail<input required type="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
    <label className="block text-sm font-bold">Sujet<input required minLength={3} maxLength={150} value={subject} onChange={e=>setSubject(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
    <label className="block text-sm font-bold">Message<textarea required minLength={10} maxLength={5000} rows={6} value={message} onChange={e=>setMessage(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3"/></label>
    <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={honeypot} onChange={e=>setHoneypot(e.target.value)} />
    <button type="submit" disabled={loading} className="h-11 rounded-xl bg-primary px-6 font-bold text-white disabled:opacity-50">{loading?"Envoi en cours…":"Envoyer le message"}</button>
  </form>;
}
export default ContactForm;
