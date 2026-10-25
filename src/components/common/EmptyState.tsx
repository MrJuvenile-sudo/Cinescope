import React from 'react'
import { Film } from 'lucide-react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`max-w-md mx-auto py-16 px-6 text-center rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-2)]/50 to-[var(--surface)] shadow-2xl space-y-5 animate-fade-up ${className}`}
    >
      <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] mx-auto flex items-center justify-center text-[var(--gold)] shadow-inner animate-float">
        {icon || <Film className="w-9 h-9" />}
      </div>

      <div>
        <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  )
}
