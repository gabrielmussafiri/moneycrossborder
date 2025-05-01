import type { User, SubAccount, TransferRequest, TopUpRequest, DebtRecord, Notification } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    region: "Global",
  },
  {
    id: "2",
    name: "DRC Agent",
    email: "drc@example.com",
    role: "drc-agent",
    region: "DRC",
  },
  {
    id: "3",
    name: "SA Agent",
    email: "sa@example.com",
    role: "sa-agent",
    region: "South Africa",
  },
]

export const mockSubAccounts: SubAccount[] = [
  {
    id: "1",
    name: "DRC - Kinshasa",
    region: "DRC",
    currency: "CDF",
    balance: 5000000,
  },
  {
    id: "2",
    name: "DRC - Lubumbashi",
    region: "DRC",
    currency: "CDF",
    balance: 3000000,
  },
  {
    id: "3",
    name: "SA - Johannesburg",
    region: "South Africa",
    currency: "ZAR",
    balance: 150000,
  },
  {
    id: "4",
    name: "SA - Cape Town",
    region: "South Africa",
    currency: "ZAR",
    balance: 100000,
  },
]

export const mockTransferRequests: TransferRequest[] = [
  {
    id: "1",
    customerName: "John Doe",
    customerPhone: "+243123456789",
    amountReceived: 500000,
    currency: "CDF",
    subAccountId: "1",
    subAccountName: "DRC - Kinshasa",
    proofAttachment: "/paper-receipt.png",
    notes: "Family support payment",
    status: "pending",
    createdAt: "2023-05-01T10:30:00Z",
    createdBy: "2",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerPhone: "+27987654321",
    amountReceived: 2000,
    currency: "ZAR",
    subAccountId: "3",
    subAccountName: "SA - Johannesburg",
    proofAttachment: "/paper-receipt.png",
    status: "completed",
    createdAt: "2023-05-02T14:15:00Z",
    createdBy: "3",
    amountToSend: 120000,
    sendingSubAccountId: "1",
    sendingProofAttachment: "/payment-confirmation.png",
    completedAt: "2023-05-02T16:30:00Z",
  },
]

export const mockTopUpRequests: TopUpRequest[] = [
  {
    id: "1",
    fromAgentId: "2",
    fromAgentName: "DRC Agent",
    toAgentId: "3",
    toAgentName: "SA Agent",
    amount: 5000,
    subAccountId: "3",
    subAccountName: "SA - Johannesburg",
    message: "Need funds for pending transfers",
    status: "pending",
    createdAt: "2023-05-03T09:45:00Z",
  },
  {
    id: "2",
    fromAgentId: "3",
    fromAgentName: "SA Agent",
    toAgentId: "2",
    toAgentName: "DRC Agent",
    amount: 300000,
    subAccountId: "1",
    subAccountName: "DRC - Kinshasa",
    status: "approved",
    createdAt: "2023-05-04T11:20:00Z",
  },
]

export const mockDebtRecords: DebtRecord[] = [
  {
    id: "1",
    debtorId: "2",
    debtorName: "DRC Agent",
    creditorId: "3",
    creditorName: "SA Agent",
    amount: 5000,
    currency: "ZAR",
    dueDate: "2023-05-10T00:00:00Z",
    status: "pending",
    createdAt: "2023-05-03T09:45:00Z",
  },
  {
    id: "2",
    debtorId: "3",
    debtorName: "SA Agent",
    creditorId: "2",
    creditorName: "DRC Agent",
    amount: 300000,
    currency: "CDF",
    dueDate: "2023-05-11T00:00:00Z",
    status: "paid",
    createdAt: "2023-05-04T11:20:00Z",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Transfer Request",
    message: "You have a new transfer request from DRC Agent",
    type: "info",
    read: false,
    createdAt: "2023-05-05T08:30:00Z",
  },
  {
    id: "2",
    title: "Top-Up Request Approved",
    message: "Your top-up request for SA - Johannesburg has been approved",
    type: "success",
    read: true,
    createdAt: "2023-05-04T16:45:00Z",
  },
  {
    id: "3",
    title: "Debt Payment Due",
    message: "You have a debt payment due in 2 days",
    type: "warning",
    read: false,
    createdAt: "2023-05-05T10:15:00Z",
  },
]
