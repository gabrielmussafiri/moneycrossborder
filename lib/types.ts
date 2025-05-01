export type UserRole = "admin" | "drc-agent" | "sa-agent"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  region: string
}

export interface SubAccount {
  id: string
  name: string
  region: string
  currency: string
  balance: number
}

export interface TransferRequest {
  id: string
  customerName: string
  customerPhone: string
  amountReceived: number
  currency: string
  subAccountId: string
  subAccountName: string
  proofAttachment: string
  notes?: string
  status: "pending" | "completed" | "rejected"
  createdAt: string
  createdBy: string
  amountToSend?: number
  sendingSubAccountId?: string
  sendingProofAttachment?: string
  completedAt?: string
}

export interface TopUpRequest {
  id: string
  fromAgentId: string
  fromAgentName: string
  toAgentId: string
  toAgentName: string
  amount: number
  subAccountId: string
  subAccountName: string
  message?: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

export interface DebtRecord {
  id: string
  debtorId: string
  debtorName: string
  creditorId: string
  creditorName: string
  amount: number
  currency: string
  dueDate: string
  status: "pending" | "paid"
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}
