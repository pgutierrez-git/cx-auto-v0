"use client"

import { useState } from "react"
import { AdminAccess } from "@/components/admin-access"
import { AdminPortal } from "./admin-portal"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <AdminAccess onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return <AdminPortal />
}
