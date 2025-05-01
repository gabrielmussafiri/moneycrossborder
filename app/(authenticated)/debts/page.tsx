"use client"

import type React from "react"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { mockDebtRecords, mockUsers } from "@/lib/mock-data"
import { Check, Loader2, Plus, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Update the component to include the new debt recording functionality
export default function DebtsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null)
  const [isRecordingDebt, setIsRecordingDebt] = useState(false)
  const [newDebtData, setNewDebtData] = useState({
    amount: "",
    currency: "USD",
    agentId: "",
    dueDate: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(true)
    }
  }

  const handlePayDebt = (debtId: string) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Payment confirmed",
        description: "Your debt payment has been recorded.",
      })

      // Reset form
      setFileUploaded(false)
      setSelectedDebt(null)
    }, 1500)
  }

  const handleNewDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDebtData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewDebtData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecordDebt = () => {
    setIsSubmitting(true)

    // Get the selected agent name for the toast message
    const selectedAgent = otherAgents.find((agent) => agent.id === newDebtData.agentId)
    const agentName = selectedAgent ? selectedAgent.name : "Unknown agent"

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Debt recorded",
        description: `A new debt of ${newDebtData.currency} ${newDebtData.amount} to ${agentName} has been recorded.`,
      })

      // Reset form and close dialog
      setNewDebtData({
        amount: "",
        currency: "USD",
        agentId: "",
        dueDate: "",
      })
      setIsRecordingDebt(false)
    }, 1500)
  }

  // Get current user role
  const userRole =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"role":"drc-agent"}').role
      : "drc-agent"

  // Filter debts based on user role
  const userDebts = mockDebtRecords.filter(
    (debt) =>
      (userRole === "drc-agent" && (debt.debtorName === "DRC Agent" || debt.creditorName === "DRC Agent")) ||
      (userRole === "sa-agent" && (debt.debtorName === "SA Agent" || debt.creditorName === "SA Agent")),
  )

  // Get agents from the other region for debt recording
  const otherAgents = mockUsers.filter(
    (user) =>
      (userRole === "drc-agent" && user.role === "sa-agent") || (userRole === "sa-agent" && user.role === "drc-agent"),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Debt Tracking</h1>
        <p className="text-muted-foreground">Monitor and manage inter-agent debts</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {userDebts.filter((debt) => debt.status === "pending").length} pending debts
        </div>
        <Dialog open={isRecordingDebt} onOpenChange={setIsRecordingDebt}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record New Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record New Debt</DialogTitle>
              <DialogDescription>Record a new debt between you and another agent</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={newDebtData.amount}
                    onChange={handleNewDebtChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={newDebtData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                    required
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CDF">CDF (Congolese Franc)</SelectItem>
                      <SelectItem value="ZAR">ZAR (South African Rand)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agentId">Select Agent</Label>
                <Select
                  value={newDebtData.agentId}
                  onValueChange={(value) => handleSelectChange("agentId", value)}
                  required
                >
                  <SelectTrigger id="agentId">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={newDebtData.dueDate}
                  onChange={handleNewDebtChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRecordingDebt(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRecordDebt}
                disabled={isSubmitting || !newDebtData.amount || !newDebtData.agentId || !newDebtData.dueDate}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  "Record Debt"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debt Records</CardTitle>
          <CardDescription>Track debts between you and other agents</CardDescription>
        </CardHeader>
        <CardContent>
          {userDebts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No debt records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Debtor</TableHead>
                  <TableHead>Creditor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDebts.map((debt) => {
                  const isDebtor =
                    (userRole === "drc-agent" && debt.debtorName === "DRC Agent") ||
                    (userRole === "sa-agent" && debt.debtorName === "SA Agent")

                  return (
                    <TableRow key={debt.id}>
                      <TableCell>
                        <div className="font-medium">{debt.debtorName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{debt.creditorName}</div>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: debt.currency,
                          maximumFractionDigits: 0,
                        }).format(debt.amount)}
                      </TableCell>
                      <TableCell>{new Date(debt.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            debt.status === "pending"
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                              : "bg-green-50 text-green-600 hover:bg-green-50"
                          }
                        >
                          {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isDebtor && debt.status === "pending" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">Pay Debt</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Pay Debt</DialogTitle>
                                <DialogDescription>Upload proof of payment to mark this debt as paid</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" value={debt.amount} disabled />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="proofAttachment">Proof of Payment</Label>
                                  <div className="flex items-center gap-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => document.getElementById("proofAttachment")?.click()}
                                    >
                                      {fileUploaded ? (
                                        <Check className="mr-2 h-4 w-4" />
                                      ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                      )}
                                      {fileUploaded ? "File Uploaded" : "Upload File"}
                                    </Button>
                                    <Input
                                      id="proofAttachment"
                                      type="file"
                                      className="hidden"
                                      accept="image/*,.pdf"
                                      onChange={handleFileChange}
                                      required
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Upload a receipt or screenshot of the payment (JPG, PNG, or PDF)
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  onClick={() => handlePayDebt(debt.id)}
                                  disabled={isSubmitting || !fileUploaded}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    "Confirm Payment"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
