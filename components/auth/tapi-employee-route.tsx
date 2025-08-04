'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useRoles } from '@/hooks/use-roles'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TapiEmployeeRouteProps {
  children: React.ReactNode
}

export function TapiEmployeeRoute({ children }: TapiEmployeeRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const { isTapiEmployee, userRole } = useRoles()
  const router = useRouter()

  // Debug logs (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 TapiEmployeeRoute - Estado:', {
      loading,
      isAuthenticated,
      isTapiEmployee,
      userEmail: user?.email,
      userRole
    })
  }

  // Renderizar siempre para debug
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-900">
        <div className="w-full max-w-md p-8">
          <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="text-gray-700 font-medium">Verificando acceso...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Mostrar información de debug en lugar de redirigir
  if (!isAuthenticated || !isTapiEmployee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-900">
        <div className="w-full max-w-md p-8">
          <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Button onClick={() => router.push('/')} className="mt-4">
                  Ir al Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Si llegamos aquí, el usuario está autenticado y es empleado de Tapi
  console.log('✅ Usuario autenticado y es empleado Tapi, permitiendo acceso')
  return <>{children}</>
} 