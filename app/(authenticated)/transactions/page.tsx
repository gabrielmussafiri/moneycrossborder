"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockTransferRequests } from "@/lib/mock-data"
import { Eye, Search } from "lucide-react"
import Image from "next/image"

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleViewProof = (transactionId: string) => {
    setSelectedTransaction(transactionId)
  }

  // Get current user role
  const userRole =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"role":"drc-agent"}').role
      : "drc-agent"

  // Filter transactions based on user role, status and search query
  const filteredTransactions = mockTransferRequests.filter((transaction) => {
    // For non-admin users, only show transactions they created
    const matchesRole =
      userRole === "admin" ||
      (userRole === "drc-agent" && transaction.createdBy === "2") ||
      (userRole === "sa-agent" && transaction.createdBy === "3")

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesSearch =
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.subAccountName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRole && matchesStatus && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">View and manage your transaction history</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Transactions</CardTitle>
          <CardDescription>View your transfer request history</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sub-Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.customerName}</p>
                        <p className="text-sm text-muted-foreground">{transaction.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: transaction.currency,
                        maximumFractionDigits: 0,
                      }).format(transaction.amountReceived)}
                    </TableCell>
                    <TableCell>{transaction.subAccountName}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "pending"
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                            : transaction.status === "completed"
                              ? "bg-green-50 text-green-600 hover:bg-green-50"
                              : "bg-red-50 text-red-600 hover:bg-red-50"
                        }
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewProof(transaction.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Proof
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Proof Viewer Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Proof</DialogTitle>
            <DialogDescription>Proof of transaction uploaded by the agent</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="relative h-[300px] w-full overflow-hidden rounded-md">
              <Image
                src={
                  mockTransferRequests.find((t) => t.id === selectedTransaction)?.proofAttachment || "/placeholder.svg"
                }
                alt="Transaction Proof"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
