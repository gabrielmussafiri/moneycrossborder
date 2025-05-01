"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockTransferRequests, mockSubAccounts } from "@/lib/mock-data"
import { Check, Eye, Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function IncomingRequestsPage() {
  const { toast } = useToast()
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [formData, setFormData] = useState({
    amountToSend: "",
    subAccountId: "",
    proofAttachment: null as File | null,
  })

  // Filter pending requests
  const pendingRequests = mockTransferRequests.filter((request) => request.status === "pending")

  const handleViewProof = (requestId: string) => {
    setSelectedRequest(requestId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, proofAttachment: e.target.files![0] }))
      setFileUploaded(true)
    }
  }

  const handleConfirmTransfer = (requestId: string) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Transfer confirmed",
        description: "The transfer has been successfully processed.",
      })

      // Reset form
      setFormData({
        amountToSend: "",
        subAccountId: "",
        proofAttachment: null,
      })
      setFileUploaded(false)

      // Close dialog
      setSelectedRequest(null)
    }, 1500)
  }

  // Filter sub-accounts based on user role (in a real app, this would be more sophisticated)
  const userRole =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || '{"role":"sa-agent"}').role : "sa-agent"

  const filteredAccounts = mockSubAccounts.filter(
    (account) =>
      (userRole === "drc-agent" && account.region === "DRC") ||
      (userRole === "sa-agent" && account.region === "South Africa"),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
        <p className="text-muted-foreground">Process incoming transfer requests from other agents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>You have {pendingRequests.length} pending transfer requests to process</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No pending requests at the moment</p>
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
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.customerName}</p>
                        <p className="text-sm text-muted-foreground">{request.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: request.currency,
                        maximumFractionDigits: 0,
                      }).format(request.amountReceived)}
                    </TableCell>
                    <TableCell>{request.subAccountName}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProof(request.id)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Process</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Process Transfer Request</DialogTitle>
                              <DialogDescription>Enter the details to complete this transfer request</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="amountToSend">Amount to Send (Local Currency)</Label>
                                <Input
                                  id="amountToSend"
                                  name="amountToSend"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={formData.amountToSend}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="subAccount">Select Sub-Account for Disbursement</Label>
                                <Select
                                  value={formData.subAccountId}
                                  onValueChange={(value) => handleSelectChange("subAccountId", value)}
                                  required
                                >
                                  <SelectTrigger id="subAccount">
                                    <SelectValue placeholder="Select sub-account" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {filteredAccounts.map((account) => (
                                      <SelectItem key={account.id} value={account.id}>
                                        {account.name} ({account.currency})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="proofAttachment">Proof of Transfer</Label>
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
                                  Upload a receipt or screenshot of the transfer (JPG, PNG, or PDF)
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                onClick={() => handleConfirmTransfer(request.id)}
                                disabled={
                                  isSubmitting || !formData.amountToSend || !formData.subAccountId || !fileUploaded
                                }
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Confirm Transfer"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Proof Viewer Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Proof of Transaction</DialogTitle>
            <DialogDescription>Transaction proof uploaded by the sending agent</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="relative h-[300px] w-full overflow-hidden rounded-md">
              <Image
                src={mockTransferRequests.find((r) => r.id === selectedRequest)?.proofAttachment || "/placeholder.svg"}
                alt="Transaction Proof"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
