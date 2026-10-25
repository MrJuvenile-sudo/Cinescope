import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface SectionHeadingProps {
  eyebrow?: string
  eyebrowColor?: 'gold' | 'crimson'
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  showHairline?: boolean
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowColor = 'gold',
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
  as = 'h2',
  className = '',
  showHairline = false,
}) => {
  const HeadingTag = as

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end justify-between gap-4 mb-3 sm:mb-4">
        <div>
          {eyebrow && (
            <span
              className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] mb-1.5 ${
                eyebrowColor === 'gold' ? 'text-[var(--gold)]' : 'text-[var(--primary)]'
              }`}
            >
              {eyebrow}
            </span>
          )}
          <HeadingTag
            className={`font-serif tracking-[-0.02em] text-[var(--text)] ${
              as === 'h1'
                ? 'text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.05]'
                : 'text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15]'
            }`}
          >
            {title}
          </HeadingTag>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--gold)] hover:text-white transition-colors duration-150 shrink-0 pb-1"
          >
            <span>{viewAllLabel}</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {showHairline && <div className="gold-hairline mt-4 mb-6 sm:mb-8" />}
    </div>
  )
}
