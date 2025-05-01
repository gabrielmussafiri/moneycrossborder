"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { Loader2, PenLine, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add a type for sub-account
interface SubAccountForm {
  type: string
  name: string
  number: string
  balance: string
}

export default function AgentsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    region: "",
    totalBalance: "",
    subAccounts: [] as SubAccountForm[],
  })

  // Initialize sub-accounts when role or region changes
  const initializeSubAccounts = (role: string) => {
    if (role === "drc-agent") {
      setFormData((prev) => ({
        ...prev,
        subAccounts: [
          { type: "mpesa", name: "M-Pesa", number: "", balance: "" },
          { type: "airtel", name: "Airtel Money", number: "", balance: "" },
          { type: "orange", name: "Orange Money", number: "", balance: "" },
          { type: "equity", name: "Equity Bank", number: "", balance: "" },
        ],
      }))
    } else if (role === "sa-agent") {
      setFormData((prev) => ({
        ...prev,
        subAccounts: [
          { type: "fnb", name: "FNB Bank", number: "", balance: "" },
          { type: "standard", name: "Standard Bank", number: "", balance: "" },
          { type: "absa", name: "ABSA", number: "", balance: "" },
        ],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        subAccounts: [],
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "role") {
      initializeSubAccounts(value)
    }
  }

  // Update the handleSubAccountChange function to properly calculate the total balance
  const handleSubAccountChange = (index: number, field: keyof SubAccountForm, value: string) => {
    const updatedSubAccounts = [...formData.subAccounts]
    updatedSubAccounts[index] = {
      ...updatedSubAccounts[index],
      [field]: value,
    }

    setFormData((prev) => ({
      ...prev,
      subAccounts: updatedSubAccounts,
    }))

    // Recalculate total balance when a sub-account balance changes
    if (field === "balance") {
      const totalBalance = updatedSubAccounts.reduce((sum, account) => {
        return sum + (Number.parseFloat(account.balance) || 0)
      }, 0)

      setFormData((prev) => ({
        ...prev,
        totalBalance: totalBalance.toString(),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Agent created",
        description: "The new agent has been added successfully.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        region: "",
        totalBalance: "",
        subAccounts: [],
      })
    }, 1500)
  }

  const handleDeleteAgent = (agentId: string) => {
    toast({
      title: "Agent deleted",
      description: "The agent has been removed from the system.",
    })
  }

  // Enhanced mockUsers with balance information
  const enhancedMockUsers = mockUsers.map((user) => {
    const subAccounts =
      user.role === "drc-agent"
        ? [
            { type: "mpesa", name: "M-Pesa", number: "+243970000001", balance: 3000000 },
            { type: "airtel", name: "Airtel Money", number: "+243810000001", balance: 2500000 },
            { type: "orange", name: "Orange Money", number: "+243890000001", balance: 2000000 },
            { type: "equity", name: "Equity Bank", number: "1234567890", balance: 1000000 },
          ]
        : user.role === "sa-agent"
          ? [
              { type: "fnb", name: "FNB Bank", number: "9876543210", balance: 100000 },
              { type: "standard", name: "Standard Bank", number: "1234567890", balance: 80000 },
              { type: "absa", name: "ABSA", number: "5678901234", balance: 70000 },
            ]
          : []

    // Calculate total balance as sum of all sub-accounts
    const totalBalance = subAccounts.reduce((sum, account) => sum + account.balance, 0)

    return {
      ...user,
      totalBalance,
      subAccounts,
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <p className="text-muted-foreground">View and manage all agents in the system</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <Input placeholder="Search agents..." className="max-w-sm" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>Create a new agent account in the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="financial" disabled={!formData.role}>
                    Financial Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleSelectChange("role", value)}
                        required
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drc-agent">DRC Agent</SelectItem>
                          <SelectItem value="sa-agent">SA Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => handleSelectChange("region", value)}
                        required
                      >
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRC">DRC</SelectItem>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="totalBalance">Total Balance</Label>
                    <Input
                      id="totalBalance"
                      name="totalBalance"
                      type="number"
                      value={formData.totalBalance}
                      onChange={handleChange}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Total balance is calculated from sub-accounts</p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-3">Sub-Accounts</h3>

                    {formData.subAccounts.map((subAccount, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="grid gap-1">
                          <Label htmlFor={`account-name-${index}`} className="text-xs">
                            Account Type
                          </Label>
                          <Input
                            id={`account-name-${index}`}
                            value={subAccount.name}
                            disabled
                            className="bg-muted text-xs"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor={`account-number-${index}`} className="text-xs">
                            Account Number
                          </Label>
                          <Input
                            id={`account-number-${index}`}
                            placeholder="Enter account number"
                            value={subAccount.number}
                            onChange={(e) => handleSubAccountChange(index, "number", e.target.value)}
                            required
                            className="text-xs"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor={`account-balance-${index}`} className="text-xs">
                            Balance
                          </Label>
                          <Input
                            id={`account-balance-${index}`}
                            type="number"
                            placeholder="0"
                            value={subAccount.balance}
                            onChange={(e) => handleSubAccountChange(index, "balance", e.target.value)}
                            required
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Agent"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Total Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancedMockUsers
                .filter((user) => user.role !== "admin")
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role === "drc-agent" ? "DRC Agent" : "SA Agent"}</Badge>
                    </TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>
                      {user.role === "drc-agent" ? (
                        <div className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "CDF",
                            maximumFractionDigits: 0,
                          }).format(user.totalBalance)}
                        </div>
                      ) : (
                        <div className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "ZAR",
                            maximumFractionDigits: 0,
                          }).format(user.totalBalance)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/agents/${user.id}`}>
                          <Button size="sm" variant="outline">
                            <PenLine className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteAgent(user.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
