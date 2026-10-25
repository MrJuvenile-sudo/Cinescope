import React from 'react'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm rounded-full border transition-all duration-200 select-none cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 min-h-[38px] font-medium ${
        selected
          ? 'bg-[rgba(229,9,20,0.16)] border-[var(--primary)] text-white shadow-[var(--shadow-glow-red)] scale-[1.02]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:scale-[1.02] active:scale-100'
      } ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 opacity-70">{icon}</span>}
      {children}
    </button>
  )
}
