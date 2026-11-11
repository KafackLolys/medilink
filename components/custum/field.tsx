"use client";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
  compact?: boolean;
};

const base =
  "h-12 w-full rounded-xl border bg-white text-base text-ink outline-none transition placeholder:text-slate-400 focus:ring-4";
const state = (error?: string) =>
  error ? "border-danger focus:ring-danger/15" : "border-slate-200 focus:border-primary focus:ring-primary/15";

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={`mt-1.5 text-sm ${error ? "text-danger" : "text-muted"}`}>
      {error ?? hint}
    </p>
  );
}

export function TextField({ label, icon, error, hint, trailing, compact, className = "", ...rest }: FieldProps) {
  const id = useId();
  const msg = `${id}-msg`;
  return (
    <div>
      <label htmlFor={id} className={`mb-1.5 block text-sm font-semibold text-ink ${compact ? "md:mb-1 md:text-xs" : ""}`}>{label}</label>
      <div className="relative">
        {icon && (
          <span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted [&>svg]:size-5 ${compact ? "md:left-3 md:[&>svg]:size-4" : ""}`}>
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? msg : undefined}
          {...rest}
          className={`${base} ${state(error)} ${icon ? "pl-12" : "pl-4"} ${trailing ? "pr-12" : "pr-4"} ${compact ? "md:h-8 md:rounded-lg md:text-xs md:pl-9 md:pr-9" : ""} ${className}`}
        />
        {trailing && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      <Message id={msg} error={error} hint={hint} />
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type" | "trailing">) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className={`grid size-10 place-items-center rounded-lg text-muted hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${props.compact ? "md:size-7" : ""}`}
        >
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      }
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; options: string[]; compact?: boolean };

export function SelectField({ label, error, options, compact, className = "", ...rest }: SelectProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={`mb-1.5 block text-sm font-semibold text-ink ${compact ? "md:mb-1 md:text-xs" : ""}`}>{label}</label>
      <select id={id} aria-invalid={!!error} {...rest} className={`${base} ${state(error)} px-4 ${compact ? "md:h-8 md:rounded-lg md:text-xs" : ""} ${className}`}>
        <option value="">Choisir une spécialité</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <Message id={`${id}-msg`} error={error} />
    </div>
  );
}
