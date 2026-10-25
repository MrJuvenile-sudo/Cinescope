import React, { useState } from 'react'
import { User } from 'lucide-react'
import { CastMember } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { SectionHeading } from '../common/SectionHeading'

export interface CastListProps {
  cast?: CastMember[] | null
  className?: string
}

interface CastItemProps {
  member: CastMember
}

const CastItem: React.FC<CastItemProps> = ({ member }) => {
  const [imageError, setImageError] = useState(false)
  const profileUrl = getImageUrl(member.profile_path, 'profile')

  const initials = member.name
    ? member.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('')
    : '?'

  return (
    <div className="group flex flex-col items-center text-center p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all duration-300">
      {/* Photo / Avatar */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-[var(--surface-2)] border border-[var(--border)] group-hover:scale-105 transition-transform duration-300 shadow-md shrink-0">
        {profileUrl && !imageError ? (
          <img
            src={profileUrl}
            alt={member.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] text-[var(--gold)]">
            {initials ? (
              <span className="font-serif text-sm font-bold tracking-wider">{initials}</span>
            ) : (
              <User className="w-6 h-6 opacity-60" />
            )}
          </div>
        )}
      </div>

      {/* Names */}
      <h4 className="font-serif text-sm font-semibold text-[var(--text)] line-clamp-1 group-hover:text-[var(--gold)] transition-colors">
        {member.name}
      </h4>
      {member.character && (
        <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
          {member.character}
        </p>
      )}
    </div>
  )
}

export const CastList: React.FC<CastListProps> = ({ cast, className = '' }) => {
  if (!cast || !Array.isArray(cast) || cast.length === 0) {
    return null
  }

  const topCast = cast.slice(0, 12)

  return (
    <section aria-labelledby="cast-heading" className={`space-y-6 ${className}`}>
      <SectionHeading
        id="cast-heading"
        as="h2"
        eyebrow="Ensemble"
        title="Top Billed Cast"
        subtitle="Principal performers credited in this production"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {topCast.map((member) => (
          <CastItem key={member.id || member.credit_id || member.name} member={member} />
        ))}
      </div>
    </section>
  )
}
