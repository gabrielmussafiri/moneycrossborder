"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockSubAccounts, mockUsers } from "@/lib/mock-data"
import { Check, Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateTransferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    amount: "",
    subAccountId: "",
    agentId: "",
    proofAttachment: null as File | null,
    notes: "",
  })
  const [fileUploaded, setFileUploaded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedAgent = otherRegionAgents.find((agent) => agent.id === formData.agentId)
    const agentName = selectedAgent ? selectedAgent.name : "Unknown agent"

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Transfer request created", 
        description: `Your transfer request has been sent to ${agentName} for processing.`,
      })
      router.push("/dashboard")
    }, 1500)
  }

  const userRole =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"role":"drc-agent"}').role
      : "drc-agent"

  const otherRegionAgents = mockUsers.filter(
    (user) =>
      (userRole === "drc-agent" && user.role === "sa-agent") || (userRole === "sa-agent" && user.role === "drc-agent"),
  )

  const filteredAccounts = mockSubAccounts.filter(
    (account) =>
      (userRole === "drc-agent" && account.region === "DRC") ||
      (userRole === "sa-agent" && account.region === "South Africa"),
  )

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create Transfer Request</h1>
          <p className="text-muted-foreground mt-3 text-lg">Fill in the details to create a new cross-border transfer request</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-2 pb-8 border-b">
            <CardTitle className="text-3xl">Transfer Details</CardTitle>
            <CardDescription className="text-base">Enter the customer and transaction information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 pt-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="customerName" className="text-base">Customer Name</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      placeholder="Full name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="customerPhone" className="text-base">Customer Phone</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      placeholder="e.g. +243123456789"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-base">Amount Received (Local Currency)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="subAccount" className="text-base">Select Sub-Account</Label>
                    <Select
                      value={formData.subAccountId}
                      onValueChange={(value) => handleSelectChange("subAccountId", value)}
                      required
                    >
                      <SelectTrigger id="subAccount" className="h-12 text-lg">
                        <SelectValue placeholder="Select sub-account" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id} className="text-base">
                            {account.name} ({account.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="agentId" className="text-base">Select Processing Agent</Label>
                  <Select
                    value={formData.agentId}
                    onValueChange={(value) => handleSelectChange("agentId", value)}
                    required
                  >
                    <SelectTrigger id="agentId" className="h-12 text-lg">
                      <SelectValue placeholder="Select agent who will process this transfer" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherRegionAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id} className="text-base">
                          {agent.name} ({agent.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the agent who will process this transfer in the destination region
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="proofAttachment" className="text-base">Proof of Transaction</Label>
                  <div className="flex items-center gap-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-lg"
                      onClick={() => document.getElementById("proofAttachment")?.click()}
                    >
                      {fileUploaded ? <Check className="mr-2 h-5 w-5" /> : <Upload className="mr-2 h-5 w-5" />}
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
                  <p className="text-sm text-muted-foreground">
                    Upload a receipt or screenshot of the transaction (JPG, PNG, or PDF)
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional information"
                    value={formData.notes}
                    onChange={handleChange}
                    className="min-h-[100px] text-lg"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4 pt-6 border-t">
              <Button variant="outline" type="button" onClick={() => router.back()} className="w-full h-12 text-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
