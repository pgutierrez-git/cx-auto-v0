'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { TapiLogo } from '@/components/ui/tapi-logo'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage('Error al autenticar: ' + error.message)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('¡Autenticación exitosa! Redirigiendo al portal...')
          
          // Redirigir al portal después de un breve delay
          setTimeout(() => {
            router.push('/admin')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No se pudo autenticar. Verifica que el enlace sea válido.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Error inesperado durante la autenticación')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900">
      <div className="w-full max-w-md p-8">
        {/* Logo Tapi */}
        <div className="flex items-center justify-center mb-8">
          <TapiLogo size="md" variant="light" />
        </div>

        {/* Card de verificación */}
        <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Verificando Acceso
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Procesando tu enlace de autenticación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex items-center justify-center space-x-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="text-gray-700 font-medium">Verificando...</span>
              </div>
            )}

            {status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 