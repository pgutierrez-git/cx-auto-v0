'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Loader2 } from 'lucide-react'
import { TapiLogo } from '@/components/ui/tapi-logo'

export function MagicLinkAuth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: '¡Enlace mágico enviado! Revisa tu correo electrónico para continuar.' 
        })
        setEmail('')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al enviar el enlace mágico' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900">
      <div className="w-full max-w-md p-8">
        {/* Logo Tapi */}
        <div className="flex items-center justify-center mb-8">
          <TapiLogo size="md" variant="light" />
        </div>

        {/* Card de autenticación */}
        <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Acceso al Portal
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tu correo electrónico para recibir un enlace de acceso seguro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 border-gray-300 focus:border-green-600 focus:ring-green-600 rounded-lg transition-colors"
                />
              </div>
              
              {message && (
                <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                  <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors" 
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Enlace Mágico
                  </>
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                El enlace expirará en 1 hora por seguridad
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 