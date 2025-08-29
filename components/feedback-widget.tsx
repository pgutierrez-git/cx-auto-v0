'use client'

import { useState } from 'react'
import { Star, Send, MessageSquare, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { submitFeedback } from '@/lib/feedback'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

interface FeedbackWidgetProps {
  variant?: 'floating' | 'modal'
  onClose?: () => void
}

export function FeedbackWidget({ variant = 'floating', onClose }: FeedbackWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState<'UI/UX' | 'Features' | 'Performance' | 'General'>('General')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (rating === 0 && !feedback.trim()) {
      toast.error('Por favor, proporciona una calificación o comentario')
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await submitFeedback({
        rating: rating || 0,
        comment: feedback.trim(),
        category,
        user_email: user?.email,
        user_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
        client_name: user?.user_metadata?.client_name
      })

      if (result.success) {
        setSubmitted(true)
        toast.success('¡Gracias por tu feedback!')
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFeedback("")
          setRating(0)
          setCategory('General')
          setIsOpen(false)
          setIsExpanded(false)
          onClose?.()
        }, 3000)
      } else {
        toast.error(result.error || 'Error al enviar feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Error al enviar feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsExpanded(false)
    onClose?.()
  }

  // Estado de éxito
  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">¡Gracias!</h3>
                <p className="text-sm text-green-600">Tu feedback es muy valioso para nosotros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Widget expandido
  if (isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Feedback</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">¿Cómo calificarías tu experiencia?</Label>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 rounded transition-all ${
                        star <= rating 
                          ? "text-yellow-400 scale-110" 
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-xs text-center text-gray-500">
                    {rating === 5 && "¡Excelente! Nos alegra que tengas una gran experiencia."}
                    {rating === 4 && "¡Muy bien! Gracias por tu valoración positiva."}
                    {rating === 3 && "Bien. ¿Cómo podemos mejorar tu experiencia?"}
                    {rating === 2 && "Entendemos que hay áreas de mejora. Tu feedback es valioso."}
                    {rating === 1 && "Lamentamos que no hayas tenido una buena experiencia. Ayúdanos a mejorar."}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Categoría</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="UI/UX">Interfaz y Experiencia</SelectItem>
                    <SelectItem value="Features">Funcionalidades</SelectItem>
                    <SelectItem value="Performance">Rendimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Comentario (opcional)</Label>
                <Textarea
                  placeholder="¿Qué te parece el portal? ¿Qué secciones te resultan útiles? ¿Te gustaría algún gráfico o funcionalidad adicional?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>

              {/* User info */}
              {user && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Enviando como: {user.email}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClose} 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting || (rating === 0 && !feedback.trim())}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Botón flotante
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 shadow-lg"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    </div>
  )
}
