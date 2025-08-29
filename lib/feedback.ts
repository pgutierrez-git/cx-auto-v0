import { supabase } from './supabase'

// Tipos para el feedback
export interface Feedback {
  id: string
  rating: number
  comment: string
  category: 'UI/UX' | 'Features' | 'Performance' | 'General'
  user_email?: string
  user_name?: string
  client_name?: string
  created_at: string
  status: 'pending' | 'reviewed' | 'resolved'
  admin_response?: string
}

export interface FeedbackFormData {
  rating: number
  comment: string
  category: 'UI/UX' | 'Features' | 'Performance' | 'General'
  user_email?: string
  user_name?: string
  client_name?: string
}

// Función para enviar feedback
export async function submitFeedback(data: FeedbackFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          rating: data.rating,
          comment: data.comment,
          category: data.category,
          user_email: data.user_email,
          user_name: data.user_name,
          client_name: data.client_name,
          status: 'pending'
        }
      ])

    if (error) {
      console.error('Error submitting feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Función para obtener feedback (para admin)
export async function getFeedback(): Promise<{ data: Feedback[] | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feedback:', error)
      return { data: null, error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return { data: null, error: 'Error interno del servidor' }
  }
}

// Función para actualizar estado del feedback (para admin)
export async function updateFeedbackStatus(
  id: string, 
  status: 'pending' | 'reviewed' | 'resolved',
  admin_response?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status }
    if (admin_response) {
      updateData.admin_response = admin_response
    }

    const { error } = await supabase
      .from('feedback')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating feedback:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

// Función para obtener estadísticas de feedback
export async function getFeedbackStats(): Promise<{ data: any; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, category, status, created_at')

    if (error) {
      console.error('Error fetching feedback stats:', error)
      return { data: null, error: error.message }
    }

    // Calcular estadísticas
    const stats = {
      total: data.length,
      averageRating: data.length > 0 ? data.reduce((sum, item) => sum + item.rating, 0) / data.length : 0,
      byRating: {
        1: data.filter(item => item.rating === 1).length,
        2: data.filter(item => item.rating === 2).length,
        3: data.filter(item => item.rating === 3).length,
        4: data.filter(item => item.rating === 4).length,
        5: data.filter(item => item.rating === 5).length,
      },
      byCategory: {
        'UI/UX': data.filter(item => item.category === 'UI/UX').length,
        'Features': data.filter(item => item.category === 'Features').length,
        'Performance': data.filter(item => item.category === 'Performance').length,
        'General': data.filter(item => item.category === 'General').length,
      },
      byStatus: {
        pending: data.filter(item => item.status === 'pending').length,
        reviewed: data.filter(item => item.status === 'reviewed').length,
        resolved: data.filter(item => item.status === 'resolved').length,
      }
    }

    return { data: stats }
  } catch (error) {
    console.error('Error calculating feedback stats:', error)
    return { data: null, error: 'Error interno del servidor' }
  }
}
