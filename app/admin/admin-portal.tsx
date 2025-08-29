"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Palette,
  Building,
  Star,
  Mail,
  Activity,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, Bar, BarChart } from "recharts"
import { TapiLogo } from "@/components/ui/tapi-logo"
import { useRoles } from "@/hooks/use-roles"
import { getFeedback, getFeedbackStats, updateFeedbackStatus } from "@/lib/feedback"
import { toast } from "sonner"

// Datos de ejemplo para clientes
const clientsData = [
  {
    id: 1,
    name: "Banco Central",
    customName: "Central Analytics Hub",
    domain: "central.nuanalytics.com",
    status: "active",
    users: 45,
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T00:00:00Z",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#60A5FA",
      background: "#F8FAFC",
    },
    analytics: {
      totalLogins: 1250,
      avgSessionTime: "12m 30s",
      feedbackCount: 23,
      avgRating: 4.2,
    },
  },
  {
    id: 2,
    name: "FinTech Solutions",
    customName: "FinTech Command Center",
    domain: "fintech.nuanalytics.com",
    status: "active",
    users: 28,
    lastLogin: "2024-01-15T14:20:00Z",
    createdAt: "2023-08-20T00:00:00Z",
    colors: {
      primary: "#059669",
      secondary: "#10B981",
      accent: "#34D399",
      background: "#F0FDF4",
    },
    analytics: {
      totalLogins: 890,
      avgSessionTime: "8m 45s",
      feedbackCount: 15,
      avgRating: 4.5,
    },
  },
  {
    id: 3,
    name: "Corporativo XYZ",
    customName: "XYZ Business Intelligence",
    domain: "xyz.nuanalytics.com",
    status: "inactive",
    users: 12,
    lastLogin: "2024-01-10T09:15:00Z",
    createdAt: "2023-11-05T00:00:00Z",
    colors: {
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      accent: "#A78BFA",
      background: "#FAF5FF",
    },
    analytics: {
      totalLogins: 340,
      avgSessionTime: "15m 20s",
      feedbackCount: 8,
      avgRating: 3.8,
    },
  },
]

// Datos de usuarios activos
const usersData = [
  {
    id: 1,
    email: "admin@central.com",
    client: "Banco Central",
    lastLogin: "2024-01-15T10:30:00Z",
    totalSessions: 45,
    avgSessionTime: "12m 30s",
    status: "online",
  },
  {
    id: 2,
    email: "analyst@fintech.com",
    client: "FinTech Solutions",
    lastLogin: "2024-01-15T14:20:00Z",
    totalSessions: 32,
    avgSessionTime: "8m 45s",
    status: "offline",
  },
  {
    id: 3,
    email: "manager@xyz.com",
    client: "Corporativo XYZ",
    lastLogin: "2024-01-10T09:15:00Z",
    totalSessions: 18,
    avgSessionTime: "15m 20s",
    status: "offline",
  },
]

// Datos de feedback
const feedbackData = [
  {
    id: 1,
    client: "Banco Central",
    user: "admin@central.com",
    rating: 5,
    comment: "Excelente portal, muy intuitivo y completo. Los gráficos son muy claros.",
    date: "2024-01-15T10:30:00Z",
    category: "UI/UX",
  },
  {
    id: 2,
    client: "FinTech Solutions",
    user: "analyst@fintech.com",
    rating: 4,
    comment: "Me gustaría ver más opciones de filtrado en los reportes.",
    date: "2024-01-14T16:45:00Z",
    category: "Features",
  },
  {
    id: 3,
    client: "Corporativo XYZ",
    user: "manager@xyz.com",
    rating: 3,
    comment: "El portal es útil pero a veces es lento para cargar los datos.",
    date: "2024-01-12T11:20:00Z",
    category: "Performance",
  },
]

// Datos para gráficos de analytics
const loginTrendsData = [
  { month: "Ago", logins: 1200 },
  { month: "Sep", logins: 1450 },
  { month: "Oct", logins: 1380 },
  { month: "Nov", logins: 1620 },
  { month: "Dic", logins: 1890 },
  { month: "Ene", logins: 2100 },
]

const clientUsageData = [
  { client: "Banco Central", usage: 85 },
  { client: "FinTech Solutions", usage: 72 },
  { client: "Corporativo XYZ", usage: 45 },
]

// Componente para gestión de clientes
const ClientManagement = () => {
  const [clients, setClients] = useState(clientsData)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.customName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const handleSaveClient = (updatedClient: any) => {
    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)))
    setIsEditModalOpen(false)
    setSelectedClient(null)
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y acciones */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription>{client.customName}</CardDescription>
                </div>
                <Badge variant={client.status === "active" ? "default" : "secondary"}>
                  {client.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Paleta de colores */}
              <div className="flex space-x-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: client.colors.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: client.colors.secondary }}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: client.colors.accent }}
                />
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Usuarios</p>
                  <p className="font-semibold">{client.users}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{client.analytics.avgRating}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent border-green-200 text-green-700 hover:bg-green-50">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Portal
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditClient(client)} className="border-green-200 text-green-700 hover:bg-green-50">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Palette className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Configura los detalles y personalización del cliente</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientEditForm
              client={selectedClient}
              onSave={handleSaveClient}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de formulario de edición de cliente
const ClientEditForm = ({ client, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(client)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Cliente</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customName">Nombre Personalizado</Label>
          <Input
            id="customName"
            value={formData.customName}
            onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Dominio</Label>
        <Input
          id="domain"
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
        />
      </div>

      {/* Paleta de colores */}
      <div className="space-y-4">
        <Label>Paleta de Colores</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary">Color Primario</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primary"
                type="color"
                value={formData.colors.primary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: { ...formData.colors, primary: e.target.value },
                  })
                }
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={formData.colors.primary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: { ...formData.colors, primary: e.target.value },
                  })
                }
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary">Color Secundario</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="secondary"
                type="color"
                value={formData.colors.secondary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: { ...formData.colors, secondary: e.target.value },
                  })
                }
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={formData.colors.secondary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: { ...formData.colors, secondary: e.target.value },
                  })
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} className="border-green-200 text-green-700 hover:bg-green-50">
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Guardar Cambios</Button>
      </div>
    </form>
  )
}

// Componente de Analytics
const AnalyticsOverview = () => {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,480</div>
            <p className="text-xs text-muted-foreground">+18% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.3 desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Logins</CardTitle>
            <CardDescription>Logins totales por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                logins: {
                  label: "Logins",
                  color: "#10B981",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={loginTrendsData}>
                <defs>
                  <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="logins" stroke="#10B981" strokeWidth={3} fill="url(#loginGradient)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso por Cliente</CardTitle>
            <CardDescription>Porcentaje de uso mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: {
                  label: "Uso %",
                  color: "#059669",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={clientUsageData}>
                <XAxis dataKey="client" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de gestión de usuarios
const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="online">En línea</SelectItem>
              <SelectItem value="offline">Desconectado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>Lista completa de usuarios con acceso a los portales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Sesiones</TableHead>
                <TableHead>Tiempo Promedio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.client}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{user.totalSessions}</TableCell>
                  <TableCell>{user.avgSessionTime}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "online" ? "default" : "secondary"}>
                      {user.status === "online" ? "En línea" : "Desconectado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de gestión de feedback
const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  // Cargar feedback real
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true)
      try {
        const { data, error } = await getFeedback()
        if (error) {
          console.error('Error loading feedback:', error)
          toast.error('Error al cargar feedback')
        } else {
          setFeedback(data || [])
        }

        // Cargar estadísticas
        const { data: statsData } = await getFeedbackStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading feedback:', error)
        toast.error('Error al cargar feedback')
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const filteredFeedback = feedback.filter((feedback) => {
    const matchesSearch =
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === "all" || feedback.rating.toString() === ratingFilter
    const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter
    return matchesSearch && matchesRating && matchesCategory
  })

  const handleUpdateStatus = async (id: string, status: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const result = await updateFeedbackStatus(id, status)
      if (result.success) {
        toast.success(`Feedback marcado como ${status === 'reviewed' ? 'revisado' : 'resuelto'}`)
        // Recargar feedback
        const { data, error } = await getFeedback()
        if (!error && data) {
          setFeedback(data)
        }
      } else {
        toast.error(result.error || 'Error al actualizar estado')
      }
    } catch (error) {
      console.error('Error updating feedback status:', error)
      toast.error('Error al actualizar estado')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="5">5 estrellas</SelectItem>
              <SelectItem value="4">4 estrellas</SelectItem>
              <SelectItem value="3">3 estrellas</SelectItem>
              <SelectItem value="2">2 estrellas</SelectItem>
              <SelectItem value="1">1 estrella</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="UI/UX">UI/UX</SelectItem>
              <SelectItem value="Features">Features</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Lista de feedback */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Cargando feedback...</span>
            </div>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay feedback</h3>
              <p className="text-gray-500">Aún no se ha recibido ningún feedback de los usuarios.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className={`ml-2 font-semibold ${getRatingColor(feedback.rating)}`}>{feedback.rating}/5</span>
                    </div>
                    <Badge variant="outline">{feedback.category}</Badge>
                    <Badge 
                      variant={feedback.status === 'pending' ? 'secondary' : feedback.status === 'reviewed' ? 'default' : 'outline'}
                      className={feedback.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {feedback.status === 'pending' ? 'Pendiente' : feedback.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(feedback.created_at)}</div>
                </div>

                <p className="text-gray-700 mb-4">{feedback.comment}</p>

                {feedback.admin_response && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Respuesta:</strong> {feedback.admin_response}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {feedback.client_name && (
                      <span>
                        <strong>Cliente:</strong> {feedback.client_name}
                      </span>
                    )}
                    <span>
                      <strong>Usuario:</strong> {feedback.user_name || feedback.user_email || 'Anónimo'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUpdateStatus(feedback.id, 'reviewed')}
                      disabled={feedback.status === 'reviewed'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como revisado
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUpdateStatus(feedback.id, 'resolved')}
                      disabled={feedback.status === 'resolved'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Componente principal del portal de administración
export function AdminPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const { userRole, isTapiEmployee } = useRoles()

  return (
    <div className="min-h-screen bg-green-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <TapiLogo size="sm" variant="dark" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Portal de Administración</h1>
                <p className="text-sm text-gray-600">Gestión centralizada de portales de clientes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {isTapiEmployee ? 'Empleado Tapi' : 'Sistema Activo'}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {userRole}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => window.location.href = '/'}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Portal Cliente
              </Button>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur-sm border border-green-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Building className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
