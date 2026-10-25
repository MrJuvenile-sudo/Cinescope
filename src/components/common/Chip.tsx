import React from 'react'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children: React.ReactNode
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center justify-center px-4 py-1.5 text-xs sm:text-sm rounded-full border transition-all duration-200 select-none cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 min-h-[36px] ${
        selected
          ? 'bg-[rgba(229,9,20,0.14)] border-[var(--primary)] text-[var(--text)] font-medium shadow-[0_0_14px_rgba(229,9,20,0.25)]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
