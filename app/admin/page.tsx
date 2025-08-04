"use client"

import { AdminPortal } from "./admin-portal"
import { TapiEmployeeRoute } from "@/components/auth/tapi-employee-route"

export default function AdminPage() {
  return (
    <TapiEmployeeRoute>
      <AdminPortal />
    </TapiEmployeeRoute>
  )
}
