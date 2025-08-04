interface TapiLogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
  className?: string
}

export function TapiLogo({ size = 'md', variant = 'light', className = '' }: TapiLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  return (
    <div className={`${className}`}>
      {/* Logo de Tapi - SVG real */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg 
          width="112" 
          height="86" 
          viewBox="0 0 112 86" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M47.5787 10.4458L28.9839 42.3806C23.221 52.2778 30.3607 64.697 41.8135 64.697L53.313 64.6969" stroke={variant === 'light' ? 'white' : 'black'} strokeWidth="20.7478" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.8012 74.7198L83.396 42.785C89.1589 32.8877 82.0191 20.4686 70.5663 20.4686L59.0668 20.4687" stroke="#09D334" strokeWidth="20.7478" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M64.5477 20.4631L41.7483 20.4632" stroke="#09D334" strokeWidth="20.7478" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M47.8307 64.7043L70.6095 64.7028" stroke={variant === 'light' ? 'white' : 'black'} strokeWidth="20.7478" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
} 