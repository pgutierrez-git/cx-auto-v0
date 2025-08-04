'use client'

import { useAuth } from './use-auth'
import { getUserRole as getTapiUserRole, isTapiEmployee } from '@/lib/tapi-config'

export type UserRole = 'client' | 'admin' | 'tapi_employee'

export function useRoles() {
  const { user } = useAuth()

  // Función para determinar el rol del usuario basado en el email
  const getUserRole = (email: string): UserRole => {
    return getTapiUserRole(email) as UserRole
  }

  const userRole = user ? getUserRole(user.email || '') : 'client'
  
  const isTapiEmployeeUser = user ? isTapiEmployee(user.email || '') : false
  const isClient = userRole === 'client'
  const isAdmin = userRole === 'admin'

  // Debug logs (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 Usuario actual:', user?.email)
    console.log('🎭 Rol del usuario:', userRole)
    console.log('🏢 ¿Es empleado Tapi?', isTapiEmployeeUser)
  }

  return {
    userRole,
    isTapiEmployee: isTapiEmployeeUser,
    isClient,
    isAdmin,
    getUserRole
  }
} 