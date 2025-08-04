// Configuración de dominios de Tapi para empleados
export const TAPI_EMPLOYEE_DOMAINS = [
  '@auntap.com',
  '@tapi.la'
]

// Configuración de roles y permisos
export const USER_ROLES = {
  CLIENT: 'client',
  TAPI_EMPLOYEE: 'tapi_employee',
  ADMIN: 'admin'
} as const

// Función para verificar si un email pertenece a un empleado de Tapi
export function isTapiEmployee(email: string): boolean {
  if (!email) return false
  
  const emailLower = email.toLowerCase()
  const isEmployee = TAPI_EMPLOYEE_DOMAINS.some(domain => 
    emailLower.includes(domain)
  )
  
  // Debug log (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Verificando email:', email)
    console.log('📧 Email en minúsculas:', emailLower)
    console.log('🏢 Dominios Tapi:', TAPI_EMPLOYEE_DOMAINS)
    console.log('✅ ¿Es empleado Tapi?', isEmployee)
  }
  
  return isEmployee
}

// Función para obtener el rol del usuario
export function getUserRole(email: string): string {
  if (isTapiEmployee(email)) {
    return USER_ROLES.TAPI_EMPLOYEE
  }
  return USER_ROLES.CLIENT
} 