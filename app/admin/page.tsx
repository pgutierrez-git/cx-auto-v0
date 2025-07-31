"use client"

import { AdminPortal } from "./admin-portal"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPortal />
    </ProtectedRoute>
  )
}
