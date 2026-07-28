import { useState } from 'react'

function FieldShell({ children }) {
  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-dash bg-dash-input px-4 py-[14px]">
      {children}
    </div>
  )
}

export function TextField({ id, label, type = 'text', placeholder, value, onChange, autoComplete }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-wide text-secondary">
        {label}
      </label>
      <FieldShell>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-[15px] text-white placeholder:text-secondary focus:outline-none"
        />
      </FieldShell>
    </div>
  )
}

export function PasswordField({ id, label, placeholder, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-wide text-secondary">
        {label}
      </label>
      <FieldShell>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-[15px] text-white placeholder:text-secondary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="shrink-0 text-secondary transition-colors hover:text-white"
        >
          <EyeIcon revealed={visible} />
        </button>
      </FieldShell>
    </div>
  )
}

function EyeIcon({ revealed }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      {revealed && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  )
}
