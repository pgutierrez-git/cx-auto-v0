"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  CreditCard,
  Smartphone,
  Banknote,
  Construction,
  Plus,
  Minus,
  Mail,
  Lock,
  Send,
  MessageSquare,
  Star,
  X,
  Settings,
  LogOut,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { MagicLinkAuth } from "@/components/auth/magic-link-auth"
import { useAuth } from "@/hooks/use-auth"
import { useRoles } from "@/hooks/use-roles"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Datos de ejemplo para los gráficos
const transactionsData = [
  { month: "Ene", servicios: 45000, recargas: 32000 },
  { month: "Feb", servicios: 52000, recargas: 38000 },
  { month: "Mar", servicios: 48000, recargas: 35000 },
  { month: "Abr", servicios: 61000, recargas: 42000 },
  { month: "May", servicios: 58000, recargas: 39000 },
  { month: "Jun", servicios: 67000, recargas: 45000 },
]

const tpvData = [
  { month: "Ene", servicios: 5625000, recargas: 2848000 },
  { month: "Feb", servicios: 6760000, recargas: 3382000 },
  { month: "Mar", servicios: 6144000, recargas: 3150000 },
  { month: "Abr", servicios: 8845000, recargas: 4620000 },
  { month: "May", servicios: 8004000, recargas: 4290000 },
  { month: "Jun", servicios: 10184000, recargas: 4950000 },
]

const ticketPromedioData = [
  { month: "Ene", servicios: 125, recargas: 89 },
  { month: "Feb", servicios: 130, recargas: 89 },
  { month: "Mar", servicios: 128, recargas: 90 },
  { month: "Abr", servicios: 145, recargas: 110 },
  { month: "May", servicios: 138, recargas: 110 },
  { month: "Jun", servicios: 152, recargas: 110 },
]

const usuariosTotalesData = [
  { month: "Ene", servicios: 28500, recargas: 35200 },
  { month: "Feb", servicios: 31200, recargas: 38100 },
  { month: "Mar", servicios: 29800, recargas: 36500 },
  { month: "Abr", servicios: 34100, recargas: 41800 },
  { month: "May", servicios: 32900, recargas: 39900 },
  { month: "Jun", servicios: 36800, recargas: 43200 },
]

const nuevosUsuariosData = [
  { month: "Ene", servicios: 2800, recargas: 3200 },
  { month: "Feb", servicios: 3100, recargas: 3500 },
  { month: "Mar", servicios: 2900, recargas: 3100 },
  { month: "Abr", servicios: 3400, recargas: 3800 },
  { month: "May", servicios: 3200, recargas: 3600 },
  { month: "Jun", servicios: 3600, recargas: 4000 },
]

// Datos de cohort para retención (formato simplificado)
const cohortData = {
  servicios: [
    { cohort: "Ene 2024", mes0: 100, mes1: 78, mes2: 65, mes3: 58, mes4: 52, mes5: 48 },
    { cohort: "Feb 2024", mes0: 100, mes1: 82, mes2: 68, mes3: 61, mes4: 55, mes5: null },
    { cohort: "Mar 2024", mes0: 100, mes1: 75, mes2: 62, mes3: 56, mes4: null, mes5: null },
    { cohort: "Abr 2024", mes0: 100, mes1: 80, mes2: 67, mes3: null, mes4: null, mes5: null },
    { cohort: "May 2024", mes0: 100, mes1: 85, mes2: null, mes3: null, mes4: null, mes5: null },
    { cohort: "Jun 2024", mes0: 100, mes1: null, mes2: null, mes3: null, mes4: null, mes5: null },
  ],
  recargas: [
    { cohort: "Ene 2024", mes0: 100, mes1: 85, mes2: 72, mes3: 68, mes4: 63, mes5: 59 },
    { cohort: "Feb 2024", mes0: 100, mes1: 88, mes2: 75, mes3: 70, mes4: 65, mes5: null },
    { cohort: "Mar 2024", mes0: 100, mes1: 82, mes2: 69, mes3: 64, mes4: null, mes5: null },
    { cohort: "Abr 2024", mes0: 100, mes1: 87, mes2: 74, mes3: null, mes4: null, mes5: null },
    { cohort: "May 2024", mes0: 100, mes1: 90, mes2: null, mes3: null, mes4: null, mes5: null },
    { cohort: "Jun 2024", mes0: 100, mes1: null, mes2: null, mes3: null, mes4: null, mes5: null },
  ],
}

// Componente de Login con Magic Link
const LoginForm = () => {
  return <MagicLinkAuth />
}

// Componente de Widget Flotante de Feedback
const FloatingFeedbackWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback("")
      setRating(0)
      setIsOpen(false)
      setIsExpanded(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-green-500 text-white p-4 rounded-2xl shadow-lg flex items-center space-x-3 animate-in slide-in-from-bottom-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">¡Gracias!</p>
            <p className="text-sm opacity-90">Tu feedback es muy valioso</p>
          </div>
        </div>
      </div>
    )
  }

  if (isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-80 animate-in slide-in-from-bottom-2">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Feedback rápido</h3>
                  <p className="text-xs text-gray-500">¿Cómo va tu experiencia?</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Rating rápido */}
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 rounded transition-all ${
                    star <= rating ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>

            {/* Comentario */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Déjanos tu comentario:</Label>
              <Textarea
                placeholder="¿Qué te parece el portal? ¿Qué secciones te resultan útiles? ¿Te gustaría algún gráfico o funcionalidad adicional?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="flex-1">
                Después
              </Button>
              <Button
                onClick={handleSubmit}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting || (rating === 0 && !feedback)}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => setIsOpen(true)}
      >
        {/* Widget expandido en hover */}
        <div
          className={`absolute bottom-0 right-0 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${
            isExpanded ? "w-64 h-12 opacity-100" : "w-12 h-12 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center h-full px-4">
            <MessageSquare className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">¿Cómo va tu experiencia?</span>
          </div>
        </div>

        {/* Botón principal */}
        <div className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>

        {/* Indicador de pulso */}
        <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"></div>
      </div>
    </div>
  )
}

// Componente de Feedback Modal
// const FeedbackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const [feedback, setFeedback] = useState("")
//   const [suggestions, setSuggestions] = useState("")
//   const [rating, setRating] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitted, setSubmitted] = useState(false)

//   const handleSubmit = async () => {
//     setIsSubmitting(true)
//     // Simular envío
//     await new Promise((resolve) => setTimeout(resolve, 2000))
//     setIsSubmitting(false)
//     setSubmitted(true)
//     // Reset form after 3 seconds and close modal
//     setTimeout(() => {
//       setSubmitted(false)
//       setFeedback("")
//       setSuggestions("")
//       setRating(0)
//       onClose()
//     }, 3000)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {submitted ? (
//           <div className="p-8">
//             <div className="flex flex-col items-center justify-center text-center">
//               <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
//                 <Send className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-semibold text-green-800 mb-2">¡Gracias por tu feedback!</h3>
//               <p className="text-green-700 text-lg">
//                 Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar continuamente.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <div className="flex items-center">
//                 <MessageSquare className="w-6 h-6 mr-3 text-purple-600" />
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">Feedback y Sugerencias</h2>
//                   <p className="text-sm text-gray-600">Comparte tu experiencia y ayúdanos a mejorar el portal</p>
//                 </div>
//               </div>
//               <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Rating */}
//               <div className="space-y-3">
//                 <Label className="text-base font-medium">¿Cómo calificarías tu experiencia general?</Label>
//                 <div className="flex space-x-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       onClick={() => setRating(star)}
//                       className={`p-2 rounded-lg transition-all ${
//                         star <= rating
//                           ? "text-yellow-400 bg-yellow-50 scale-110"
//                           : "text-gray-300 hover:text-yellow-300 hover:bg-gray-50"
//                       }`}
//                     >
//                       <Star className="w-8 h-8 fill-current" />
//                     </button>
//                   ))}
//                 </div>
//                 {rating > 0 && (
//                   <p className="text-sm text-gray-600">
//                     {rating === 5 && "¡Excelente! Nos alegra que tengas una gran experiencia."}
//                     {rating === 4 && "¡Muy bien! Gracias por tu valoración positiva."}
//                     {rating === 3 && "Bien. ¿Cómo podemos mejorar tu experiencia?"}
//                     {rating === 2 && "Entendemos que hay áreas de mejora. Tu feedback es valioso."}
//                     {rating === 1 && "Lamentamos que no hayas tenido una buena experiencia. Ayúdanos a mejorar."}
//                   </p>
//                 )}
//               </div>

//               {/* Feedback */}
//               <div className="space-y-3">
//                 <Label htmlFor="feedback" className="text-base font-medium">
//                   ¿Qué te parece el portal actual?
//                 </Label>
//                 <Textarea
//                   id="feedback"
//                   placeholder="Comparte tu experiencia, qué te gusta, qué no te gusta, qué te resulta útil..."
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                   rows={4}
//                   className="resize-none"
//                 />
//               </div>

//               {/* Suggestions */}
//               <div className="space-y-3">
//                 <Label htmlFor="suggestions" className="text-base font-medium">
//                   ¿Qué funcionalidades o información te gustaría ver?
//                 </Label>
//                 <Textarea
//                   id="suggestions"
//                   placeholder="Nuevos gráficos, métricas adicionales, filtros, exportaciones, comparativas, etc."
//                   value={suggestions}
//                   onChange={(e) => setSuggestions(e.target.value)}
//                   rows={4}
//                   className="resize-none"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
//               <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
//                 Cancelar
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 className="bg-purple-600 hover:bg-purple-700"
//                 disabled={isSubmitting || (!feedback && !suggestions && rating === 0)}
//               >
//                 {isSubmitting ? "Enviando..." : "Enviar Feedback"}
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// Componente para Highlights/Lowlights
const HighlightsLowlights = ({ section, metric }: { section: string; metric: string }) => {
  const [highlights, setHighlights] = useState<string[]>([])
  const [lowlights, setLowlights] = useState<string[]>([])

  // Datos de ejemplo iniciales
  const exampleData: Record<string, Record<string, { highlights: string[]; lowlights: string[] }>> = {
    servicios: {
      transacciones: {
        highlights: ["Crecimiento del 15.5% vs mes anterior", "Pico histórico en pagos de luz"],
        lowlights: ["Caída del 8% en pagos de agua", "Menor actividad los fines de semana"],
      },
      tpv: {
        highlights: ["TPV récord de $10.2M en junio", "Incremento del 27% vs mismo mes 2023"],
        lowlights: ["Volatilidad en la segunda semana del mes"],
      },
      ticket: {
        highlights: ["Ticket promedio alcanzó $152", "Mejora sostenida desde abril"],
        lowlights: ["Dispersión alta en montos pequeños"],
      },
      usuarios: {
        highlights: ["36.8K usuarios activos", "Crecimiento del 12% mensual"],
        lowlights: ["Menor engagement en usuarios nuevos"],
      },
      nuevos: {
        highlights: ["3.6K nuevos usuarios en junio", "Mejor mes del trimestre"],
        lowlights: ["Conversión del 68% desde registro"],
      },
      retencion: {
        highlights: ["Retención mes 1: 85%", "Mejora vs cohortes anteriores"],
        lowlights: ["Caída pronunciada en mes 3"],
      },
    },
    recargas: {
      transacciones: {
        highlights: ["45K transacciones en junio", "Crecimiento estable del 15%"],
        lowlights: ["Competencia agresiva en el sector"],
      },
      tpv: {
        highlights: ["$4.95M en TPV total", "Incremento del 15.4% mensual"],
        lowlights: ["Presión en márgenes por promociones"],
      },
      ticket: {
        highlights: ["Ticket estable en $110", "Consistencia en últimos 3 meses"],
        lowlights: ["Oportunidad de upselling no aprovechada"],
      },
      usuarios: {
        highlights: ["43.2K usuarios activos", "Base sólida y creciente"],
        lowlights: ["Concentración en pocos operadores"],
      },
      nuevos: {
        highlights: ["4K nuevos usuarios", "Mejor adquisición del año"],
        lowlights: ["Costo de adquisición en aumento"],
      },
      retencion: {
        highlights: ["Retención mes 1: 90%", "Mejor performance vs servicios"],
        lowlights: ["Plateau en retención a largo plazo"],
      },
    },
  }

  const currentData = exampleData[section]?.[metric] || { highlights: [], lowlights: [] }

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlights */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-800 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Highlights
            </h4>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {currentData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-green-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lowlights */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-orange-800 flex items-center">
              <Minus className="w-4 h-4 mr-2" />
              Lowlights
            </h4>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {currentData.lowlights.map((lowlight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-orange-700">{lowlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para tabla de cohort
const CohortTable = ({ data }: { data: any[] }) => {
  const getColorIntensity = (value: number | null) => {
    if (value === null) return "bg-gray-100"
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-green-400"
    if (value >= 40) return "bg-yellow-400"
    return "bg-red-400"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium text-gray-600">Cohort</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 0</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 1</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 2</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 3</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 4</th>
            <th className="text-center p-2 font-medium text-gray-600">Mes 5</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 font-medium text-gray-700">{row.cohort}</td>
              {[row.mes0, row.mes1, row.mes2, row.mes3, row.mes4, row.mes5].map((value, cellIndex) => (
                <td key={cellIndex} className="p-2 text-center">
                  {value !== null ? (
                    <div
                      className={`inline-flex items-center justify-center w-12 h-8 rounded text-white text-xs font-medium ${getColorIntensity(value)}`}
                    >
                      {value}%
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-12 h-8 rounded bg-gray-100 text-gray-400 text-xs">
                      -
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function NuTransactionalPortal() {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const { isTapiEmployee } = useRoles()
  const [activeTab, setActiveTab] = useState("servicios")
  const router = useRouter()



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-PE").format(value)
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Nu</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Nu Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Junio 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Bienvenido, {user?.email}</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Actualizado
              </Badge>
              {isTapiEmployee && (
                <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                  Empleado Tapi
                </Badge>
              )}
              <Button variant="outline" size="sm">
                Exportar
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
              {isTapiEmployee && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/admin")}
                  className="bg-green-600 text-white border-green-600 hover:bg-green-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Portal Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1">
            <TabsTrigger value="servicios" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger value="recargas" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Smartphone className="w-4 h-4 mr-2" />
              Recargas
            </TabsTrigger>
            <TabsTrigger value="cashin" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Banknote className="w-4 h-4 mr-2" />
              Cash-in
            </TabsTrigger>
          </TabsList>

          {/* Servicios */}
          <TabsContent value="servicios" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolución de Transacciones */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de TPN</CardTitle>
                  <CardDescription className="text-gray-600">Número de transacciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      servicios: {
                        label: "Servicios",
                        color: "#8B5CF6",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={transactionsData}>
                      <defs>
                        <linearGradient id="transactionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => [formatNumber(Number(value)), "Transacciones"]} />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="servicios"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="url(#transactionsGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                  <HighlightsLowlights section="servicios" metric="transacciones" />
                </CardContent>
              </Card>

              {/* Evolución de TPV */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de TPV</CardTitle>
                  <CardDescription className="text-gray-600">Total Payment Volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      servicios: {
                        label: "TPV Servicios",
                        color: "#10B981",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={tpvData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => formatCurrency(value / 1000000) + "M"}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent formatter={(value) => [formatCurrency(Number(value)), "TPV"]} />}
                      />
                      <Line
                        type="monotone"
                        dataKey="servicios"
                        stroke="#10B981"
                        strokeWidth={4}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="servicios" metric="tpv" />
                </CardContent>
              </Card>

              {/* Evolución de Ticket Promedio */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Ticket Promedio</CardTitle>
                  <CardDescription className="text-gray-600">Valor promedio por transacción</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      servicios: {
                        label: "Ticket Promedio",
                        color: "#F59E0B",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={ticketPromedioData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [formatCurrency(Number(value)), "Ticket Promedio"]}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="servicios"
                        stroke="#F59E0B"
                        strokeWidth={4}
                        dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="servicios" metric="ticket" />
                </CardContent>
              </Card>

              {/* Evolución de Usuarios Totales */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Usuarios Totales</CardTitle>
                  <CardDescription className="text-gray-600">Usuarios activos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      servicios: {
                        label: "Usuarios Totales",
                        color: "#EF4444",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={usuariosTotalesData}>
                      <defs>
                        <linearGradient id="usuariosGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => [formatNumber(Number(value)), "Usuarios"]} />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="servicios"
                        stroke="#EF4444"
                        strokeWidth={3}
                        fill="url(#usuariosGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                  <HighlightsLowlights section="servicios" metric="usuarios" />
                </CardContent>
              </Card>

              {/* Evolución de Nuevos Usuarios */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Nuevos Usuarios</CardTitle>
                  <CardDescription className="text-gray-600">Adquisición mensual de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      servicios: {
                        label: "Nuevos Usuarios",
                        color: "#06B6D4",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={nuevosUsuariosData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [formatNumber(Number(value)), "Nuevos Usuarios"]}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="servicios"
                        stroke="#06B6D4"
                        strokeWidth={4}
                        dot={{ fill: "#06B6D4", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#06B6D4", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="servicios" metric="nuevos" />
                </CardContent>
              </Card>

              {/* Retención de Usuarios (Cohort) */}
              <Card className="bg-white border-gray-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-900">Retención de Usuarios (Cohort)</CardTitle>
                  <CardDescription className="text-gray-600">Análisis de retención por cohorte mensual</CardDescription>
                </CardHeader>
                <CardContent>
                  <CohortTable data={cohortData.servicios} />
                  <HighlightsLowlights section="servicios" metric="retencion" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recargas" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolución de Transacciones */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de TPN</CardTitle>
                  <CardDescription className="text-gray-600">Número de transacciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recargas: {
                        label: "Recargas",
                        color: "#8B5CF6",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={transactionsData}>
                      <defs>
                        <linearGradient id="recargasTransactionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => [formatNumber(Number(value)), "Transacciones"]} />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="recargas"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="url(#recargasTransactionsGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                  <HighlightsLowlights section="recargas" metric="transacciones" />
                </CardContent>
              </Card>

              {/* Evolución de TPV */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de TPV</CardTitle>
                  <CardDescription className="text-gray-600">Total Payment Volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recargas: {
                        label: "TPV Recargas",
                        color: "#10B981",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={tpvData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => formatCurrency(value / 1000000) + "M"}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent formatter={(value) => [formatCurrency(Number(value)), "TPV"]} />}
                      />
                      <Line
                        type="monotone"
                        dataKey="recargas"
                        stroke="#10B981"
                        strokeWidth={4}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="recargas" metric="tpv" />
                </CardContent>
              </Card>

              {/* Evolución de Ticket Promedio */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Ticket Promedio</CardTitle>
                  <CardDescription className="text-gray-600">Valor promedio por transacción</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recargas: {
                        label: "Ticket Promedio",
                        color: "#F59E0B",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={ticketPromedioData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [formatCurrency(Number(value)), "Ticket Promedio"]}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="recargas"
                        stroke="#F59E0B"
                        strokeWidth={4}
                        dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="recargas" metric="ticket" />
                </CardContent>
              </Card>

              {/* Evolución de Usuarios Totales */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Usuarios Totales</CardTitle>
                  <CardDescription className="text-gray-600">Usuarios activos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recargas: {
                        label: "Usuarios Totales",
                        color: "#EF4444",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={usuariosTotalesData}>
                      <defs>
                        <linearGradient id="recargasUsuariosGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => [formatNumber(Number(value)), "Usuarios"]} />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="recargas"
                        stroke="#EF4444"
                        strokeWidth={3}
                        fill="url(#recargasUsuariosGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                  <HighlightsLowlights section="recargas" metric="usuarios" />
                </CardContent>
              </Card>

              {/* Evolución de Nuevos Usuarios */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Evolución de Nuevos Usuarios</CardTitle>
                  <CardDescription className="text-gray-600">Adquisición mensual de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recargas: {
                        label: "Nuevos Usuarios",
                        color: "#06B6D4",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart data={nuevosUsuariosData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [formatNumber(Number(value)), "Nuevos Usuarios"]}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="recargas"
                        stroke="#06B6D4"
                        strokeWidth={4}
                        dot={{ fill: "#06B6D4", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#06B6D4", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                  <HighlightsLowlights section="recargas" metric="nuevos" />
                </CardContent>
              </Card>

              {/* Retención de Usuarios (Cohort) */}
              <Card className="bg-white border-gray-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-900">Retención de Usuarios (Cohort)</CardTitle>
                  <CardDescription className="text-gray-600">Análisis de retención por cohorte mensual</CardDescription>
                </CardHeader>
                <CardContent>
                  <CohortTable data={cohortData.recargas} />
                  <HighlightsLowlights section="recargas" metric="retencion" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cash-in - En Desarrollo */}
          <TabsContent value="cashin" className="space-y-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="bg-white border-gray-200 max-w-md w-full">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Construction className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">En Desarrollo</h3>
                  <p className="text-gray-600 mb-6">
                    Los reportes de Cash-in están siendo desarrollados y estarán disponibles próximamente.
                  </p>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Próximamente
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

        {/* Feedback Modal */}
        <FloatingFeedbackWidget />
      </div>
    </ProtectedRoute>
  )
}
