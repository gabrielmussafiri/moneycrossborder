"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockTopUpRequests, mockUsers, mockSubAccounts } from "@/lib/mock-data"
import { Check, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TopUpPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    toAgentId: "",
    amount: "",
    subAccountId: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Top-up request sent",
        description: "Your top-up request has been sent successfully.",
      })

      // Reset form
      setFormData({
        toAgentId: "",
        amount: "",
        subAccountId: "",
        message: "",
      })
    }, 1500)
  }

  const handleApprove = (requestId: string) => {
    toast({
      title: "Top-up request approved",
      description: "The top-up request has been approved.",
    })
  }

  const handleDecline = (requestId: string) => {
    toast({
      title: "Top-up request declined",
      description: "The top-up request has been declined.",
    })
  }

  // Get current user role
  const userRole =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"role":"drc-agent"}').role
      : "drc-agent"

  // Filter agents based on current user role
  const otherAgents = mockUsers.filter((user) => user.role !== userRole && user.role !== "admin")

  // Filter sub-accounts based on user role
  const filteredAccounts = mockSubAccounts.filter(
    (account) =>
      (userRole === "drc-agent" && account.region === "DRC") ||
      (userRole === "sa-agent" && account.region === "South Africa"),
  )

  // Filter incoming and outgoing top-up requests
  const incomingRequests = mockTopUpRequests.filter(
    (request) =>
      (userRole === "drc-agent" && request.toAgentName === "DRC Agent") ||
      (userRole === "sa-agent" && request.toAgentName === "SA Agent"),
  )

  const outgoingRequests = mockTopUpRequests.filter(
    (request) =>
      (userRole === "drc-agent" && request.fromAgentName === "DRC Agent") ||
      (userRole === "sa-agent" && request.fromAgentName === "SA Agent"),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Top-Up Requests</h1>
        <p className="text-muted-foreground">Request and manage top-ups between agents</p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
          <TabsTrigger value="create">Create Request</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Top-Up Requests</CardTitle>
              <CardDescription>Manage top-up requests from other agents</CardDescription>
            </CardHeader>
            <CardContent>
              {incomingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No incoming top-up requests at the moment</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Agent</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Sub-Account</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.fromAgentName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(request.amount)}
                        </TableCell>
                        <TableCell>{request.subAccountName}</TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "pending"
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                                : request.status === "approved"
                                  ? "bg-green-50 text-green-600 hover:bg-green-50"
                                  : "bg-red-50 text-red-600 hover:bg-red-50"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleApprove(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDecline(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Top-Up Requests</CardTitle>
              <CardDescription>Track the status of your top-up requests</CardDescription>
            </CardHeader>
            <CardContent>
              {outgoingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No outgoing top-up requests at the moment</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>To Agent</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Sub-Account</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outgoingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.toAgentName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(request.amount)}
                        </TableCell>
                        <TableCell>{request.subAccountName}</TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "pending"
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                                : request.status === "approved"
                                  ? "bg-green-50 text-green-600 hover:bg-green-50"
                                  : "bg-red-50 text-red-600 hover:bg-red-50"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Create Top-Up Request</CardTitle>
              <CardDescription>Request funds from another agent</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="toAgentId">Select Agent</Label>
                    <Select
                      value={formData.toAgentId}
                      onValueChange={(value) => handleSelectChange("toAgentId", value)}
                      required
                    >
                      <SelectTrigger id="toAgentId">
                        <SelectValue placeholder="Select agent to request from" />
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subAccountId">Select Sub-Account</Label>
                      <Select
                        value={formData.subAccountId}
                        onValueChange={(value) => handleSelectChange("subAccountId", value)}
                        required
                      >
                        <SelectTrigger id="subAccountId">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Add a message for the agent"
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
