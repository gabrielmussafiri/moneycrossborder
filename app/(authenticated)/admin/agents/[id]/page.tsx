"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUsers } from "@/lib/mock-data"
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SubAccount {
  type: string
  name: string
  number: string
  balance: number
}

interface EnhancedUser {
  id: string
  name: string
  email: string
  role: string
  region: string
  totalBalance: number
  subAccounts: SubAccount[]
}

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agent, setAgent] = useState<EnhancedUser | null>(null)
  const [editingSubAccount, setEditingSubAccount] = useState<{ index: number; data: SubAccount } | null>(null)
  const [newSubAccount, setNewSubAccount] = useState<{
    type: string
    name: string
    number: string
    balance: string
  }>({
    type: "",
    name: "",
    number: "",
    balance: "",
  })
  const [isAddingSubAccount, setIsAddingSubAccount] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch agent details
    setTimeout(() => {
      const agentId = params.id as string

      // Find the agent in our mock data
      const foundAgent = mockUsers.find((user) => user.id === agentId)

      if (foundAgent) {
        // Enhance with balance information
        const enhancedAgent: EnhancedUser = {
          ...foundAgent,
          totalBalance: foundAgent.role === "drc-agent" ? 8500000 : 250000,
          subAccounts:
            foundAgent.role === "drc-agent"
              ? [
                  { type: "mpesa", name: "M-Pesa", number: "+243970000001", balance: 3000000 },
                  { type: "airtel", name: "Airtel Money", number: "+243810000001", balance: 2500000 },
                  { type: "orange", name: "Orange Money", number: "+243890000001", balance: 2000000 },
                  { type: "equity", name: "Equity Bank", number: "1234567890", balance: 1000000 },
                ]
              : [
                  { type: "fnb", name: "FNB Bank", number: "9876543210", balance: 100000 },
                  { type: "standard", name: "Standard Bank", number: "1234567890", balance: 80000 },
                  { type: "absa", name: "ABSA", number: "5678901234", balance: 70000 },
                ],
        }

        setAgent(enhancedAgent)
      }

      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleSave = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Agent updated",
        description: "The agent information has been updated successfully.",
      })
    }, 1500)
  }

  const handleEditSubAccount = (index: number) => {
    if (agent) {
      setEditingSubAccount({
        index,
        data: { ...agent.subAccounts[index] },
      })
    }
  }

  const handleUpdateSubAccount = () => {
    if (agent && editingSubAccount) {
      const updatedSubAccounts = [...agent.subAccounts]
      updatedSubAccounts[editingSubAccount.index] = editingSubAccount.data

      // Recalculate total balance
      const totalBalance = updatedSubAccounts.reduce((sum, account) => sum + account.balance, 0)

      setAgent({
        ...agent,
        subAccounts: updatedSubAccounts,
        totalBalance,
      })

      toast({
        title: "Sub-account updated",
        description: `${editingSubAccount.data.name} account has been updated successfully.`,
      })

      setEditingSubAccount(null)
    }
  }

  const handleSubAccountChange = (field: keyof SubAccount, value: string) => {
    if (editingSubAccount) {
      setEditingSubAccount({
        ...editingSubAccount,
        data: {
          ...editingSubAccount.data,
          [field]: field === "balance" ? Number(value) : value,
        },
      })
    }
  }

  const handleNewSubAccountChange = (field: keyof typeof newSubAccount, value: string) => {
    setNewSubAccount({
      ...newSubAccount,
      [field]: value,
    })

    // Update name based on type selection
    if (field === "type") {
      const nameMap: Record<string, string> = {
        mpesa: "M-Pesa",
        airtel: "Airtel Money",
        orange: "Orange Money",
        equity: "Equity Bank",
        fnb: "FNB Bank",
        standard: "Standard Bank",
        absa: "ABSA",
        other: "Other Account",
      }

      setNewSubAccount({
        ...newSubAccount,
        type: value,
        name: nameMap[value] || "Other Account",
      })
    }
  }

  const handleAddSubAccount = () => {
    if (agent && newSubAccount.type && newSubAccount.number && newSubAccount.balance) {
      const updatedSubAccounts = [
        ...agent.subAccounts,
        {
          type: newSubAccount.type,
          name: newSubAccount.name,
          number: newSubAccount.number,
          balance: Number(newSubAccount.balance),
        },
      ]

      // Recalculate total balance
      const totalBalance = updatedSubAccounts.reduce((sum, account) => sum + account.balance, 0)

      setAgent({
        ...agent,
        subAccounts: updatedSubAccounts,
        totalBalance,
      })

      toast({
        title: "Sub-account added",
        description: `${newSubAccount.name} account has been added successfully.`,
      })

      // Reset form and close dialog
      setNewSubAccount({
        type: "",
        name: "",
        number: "",
        balance: "",
      })
      setIsAddingSubAccount(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Agent Details</h1>
        </div>

        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Agent Details</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Agent not found</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Determine available account types based on agent role
  const availableAccountTypes =
    agent.role === "drc-agent"
      ? [
          { value: "mpesa", label: "M-Pesa" },
          { value: "airtel", label: "Airtel Money" },
          { value: "orange", label: "Orange Money" },
          { value: "equity", label: "Equity Bank" },
          { value: "other", label: "Other" },
        ]
      : [
          { value: "fnb", label: "FNB Bank" },
          { value: "standard", label: "Standard Bank" },
          { value: "absa", label: "ABSA" },
          { value: "other", label: "Other" },
        ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Agent Details</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {agent.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {agent.role === "drc-agent" ? "DRC Agent" : "SA Agent"}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Agent Details</TabsTrigger>
          <TabsTrigger value="financial">Financial Information</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>View and edit agent details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={agent.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={agent.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue={agent.role === "drc-agent" ? "DRC Agent" : "SA Agent"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" defaultValue={agent.region} disabled className="bg-muted" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>Manage agent balances and accounts</CardDescription>
              </div>
              <Dialog open={isAddingSubAccount} onOpenChange={setIsAddingSubAccount}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Sub-Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sub-Account</DialogTitle>
                    <DialogDescription>Add a new payment method or bank account for this agent</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={newSubAccount.type}
                        onValueChange={(value) => handleNewSubAccountChange("type", value)}
                      >
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAccountTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {newSubAccount.type === "other" && (
                      <div className="grid gap-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          placeholder="Enter account name"
                          value={newSubAccount.name}
                          onChange={(e) => handleNewSubAccountChange("name", e.target.value)}
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account number"
                        value={newSubAccount.number}
                        onChange={(e) => handleNewSubAccountChange("number", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="accountBalance">Initial Balance</Label>
                      <Input
                        id="accountBalance"
                        type="number"
                        placeholder="0"
                        value={newSubAccount.balance}
                        onChange={(e) => handleNewSubAccountChange("balance", e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddSubAccount}
                      disabled={!newSubAccount.type || !newSubAccount.number || !newSubAccount.balance}
                    >
                      Add Sub-Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="totalBalance" className="text-base">
                  Total Balance
                </Label>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: agent.role === "drc-agent" ? "CDF" : "ZAR",
                      maximumFractionDigits: 0,
                    }).format(agent.totalBalance)}
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {agent.role === "drc-agent" ? "CDF" : "ZAR"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Total sum of all sub-accounts</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sub-Accounts</h3>

                {agent.subAccounts.map((account, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Account Type</Label>
                          <div className="font-medium">{account.name}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Account Number</Label>
                          <div className="font-medium">{account.number}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Balance</Label>
                          <div className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: agent.role === "drc-agent" ? "CDF" : "ZAR",
                              maximumFractionDigits: 0,
                            }).format(account.balance)}
                          </div>
                        </div>
                        <div className="flex items-end justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditSubAccount(index)}>
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Sub-Account</DialogTitle>
                                <DialogDescription>Update the details for this sub-account</DialogDescription>
                              </DialogHeader>
                              {editingSubAccount && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-account-type">Account Type</Label>
                                    <Input
                                      id="edit-account-type"
                                      value={editingSubAccount.data.name}
                                      disabled
                                      className="bg-muted"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-account-number">Account Number</Label>
                                    <Input
                                      id="edit-account-number"
                                      value={editingSubAccount.data.number}
                                      onChange={(e) => handleSubAccountChange("number", e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-account-balance">Balance</Label>
                                    <Input
                                      id="edit-account-balance"
                                      type="number"
                                      value={editingSubAccount.data.balance}
                                      onChange={(e) => handleSubAccountChange("balance", e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button onClick={handleUpdateSubAccount}>Update Sub-Account</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
