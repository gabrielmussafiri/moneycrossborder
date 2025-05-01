"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, FileText, Users } from "lucide-react"
import { mockUsers, mockSubAccounts, mockTransferRequests, mockDebtRecords } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  const totalBalance = mockSubAccounts.reduce((sum, account) => sum + account.balance, 0)
  const pendingTransfers = mockTransferRequests.filter((req) => req.status === "pending").length
  const pendingDebts = mockDebtRecords.filter((debt) => debt.status === "pending").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive control over the platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(totalBalance / 2000)}{" "}
              USD
            </div>
            <p className="text-xs text-muted-foreground">Across all sub-accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.filter((user) => user.role !== "admin").length}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransfers}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Debts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDebts}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agent Overview</CardTitle>
            <CardDescription>Quick view of all agents in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers
                  .filter((user) => user.role !== "admin")
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role === "drc-agent" ? "DRC Agent" : "SA Agent"}</Badge>
                      </TableCell>
                      <TableCell>{user.region}</TableCell>
                      <TableCell>
                        <Link href={`/admin/agents/${user.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Link href="/admin/agents">
                <Button variant="link" size="sm">
                  View All Agents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest transfer requests in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransferRequests.slice(0, 5).map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      <div className="font-medium">{transfer.customerName}</div>
                      <div className="text-sm text-muted-foreground">{transfer.customerPhone}</div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: transfer.currency,
                        maximumFractionDigits: 0,
                      }).format(transfer.amountReceived)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          transfer.status === "pending"
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                            : transfer.status === "completed"
                              ? "bg-green-50 text-green-600 hover:bg-green-50"
                              : "bg-red-50 text-red-600 hover:bg-red-50"
                        }
                      >
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/transactions/${transfer.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Link href="/admin/transactions">
                <Button variant="link" size="sm">
                  View All Transactions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sub-Account Balances</CardTitle>
            <CardDescription>Current balances across all sub-accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="drc">DRC</TabsTrigger>
                <TabsTrigger value="sa">South Africa</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="font-medium">{account.name}</div>
                        </TableCell>
                        <TableCell>{account.region}</TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: account.currency,
                            maximumFractionDigits: 0,
                          }).format(account.balance)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/accounts/${account.id}`}>
                            <Button size="sm" variant="outline">
                              Adjust Balance
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="drc">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubAccounts
                      .filter((account) => account.region === "DRC")
                      .map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="font-medium">{account.name}</div>
                          </TableCell>
                          <TableCell>{account.region}</TableCell>
                          <TableCell>{account.currency}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: account.currency,
                              maximumFractionDigits: 0,
                            }).format(account.balance)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/accounts/${account.id}`}>
                              <Button size="sm" variant="outline">
                                Adjust Balance
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="sa">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubAccounts
                      .filter((account) => account.region === "South Africa")
                      .map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="font-medium">{account.name}</div>
                          </TableCell>
                          <TableCell>{account.region}</TableCell>
                          <TableCell>{account.currency}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: account.currency,
                              maximumFractionDigits: 0,
                            }).format(account.balance)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/accounts/${account.id}`}>
                              <Button size="sm" variant="outline">
                                Adjust Balance
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
