import React from 'react'

export interface DividerProps {
  className?: string
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return (
    <div
      role="separator"
      className={`gold-hairline my-8 sm:my-12 ${className}`}
    />
  )
}
