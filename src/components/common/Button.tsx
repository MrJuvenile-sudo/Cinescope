import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 min-h-[40px] sm:min-h-[36px] rounded-[10px] gap-1.5',
      md: 'text-sm px-4 py-2.5 min-h-[44px] rounded-[12px] gap-2',
      lg: 'text-base px-6 py-3 min-h-[48px] rounded-[12px] gap-2.5',
    }[size]

    const variantClasses = {
      primary:
        'bg-gradient-to-b from-[#ff3040] to-[#E50914] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.22),var(--shadow-glow-red)] hover:brightness-110 hover:-translate-y-[2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_32px_rgba(229,9,20,0.45)] active:translate-y-0 active:brightness-95 active:shadow-none',
      secondary:
        'bg-[rgba(10,10,13,0.72)] border border-[var(--border)] text-[var(--text)] hover:text-white hover:border-[var(--border-strong)] hover:bg-white/8 hover:-translate-y-[1px] active:translate-y-0 font-medium backdrop-blur-md',
      ghost:
        'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 active:bg-white/10 font-medium',
    }[variant]

    const disabledClasses = disabled
      ? 'opacity-45 cursor-not-allowed pointer-events-none shadow-none transform-none'
      : 'cursor-pointer'

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center select-none transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
