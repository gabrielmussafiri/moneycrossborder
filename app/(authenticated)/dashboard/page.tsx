import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, DollarSign, Inbox, RefreshCw } from "lucide-react"
import { mockSubAccounts, mockNotifications } from "@/lib/mock-data"

export default function DashboardPage() {
  const totalBalance = mockSubAccounts.reduce((sum, account) => sum + account.balance, 0)
  const drcAccounts = mockSubAccounts.filter((account) => account.region === "DRC")
  const saAccounts = mockSubAccounts.filter((account) => account.region === "South Africa")

  const drcTotal = drcAccounts.reduce((sum, account) => sum + account.balance, 0)
  const saTotal = saAccounts.reduce((sum, account) => sum + account.balance, 0)

  const unreadNotifications = mockNotifications.filter((notification) => !notification.read)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cross-border transfer operations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top-Up Requests</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">-1</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sub-Account Balances</CardTitle>
            <CardDescription>Current balances across all your sub-accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="drc">DRC</TabsTrigger>
                <TabsTrigger value="sa">South Africa</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockSubAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: account.currency,
                          maximumFractionDigits: 0,
                        }).format(account.balance)}
                      </p>
                      <p className="text-sm text-muted-foreground">{account.currency}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t flex items-center justify-between font-bold">
                  <p>Total (USD Equivalent)</p>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(totalBalance / 2000)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="drc" className="space-y-4">
                {drcAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: account.currency,
                          maximumFractionDigits: 0,
                        }).format(account.balance)}
                      </p>
                      <p className="text-sm text-muted-foreground">{account.currency}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t flex items-center justify-between font-bold">
                  <p>Total (USD Equivalent)</p>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(drcTotal / 2000)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="sa" className="space-y-4">
                {saAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: account.currency,
                          maximumFractionDigits: 0,
                        }).format(account.balance)}
                      </p>
                      <p className="text-sm text-muted-foreground">{account.currency}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t flex items-center justify-between font-bold">
                  <p>Total (USD Equivalent)</p>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(saTotal / 2000)}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>You have {unreadNotifications.length} unread notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 rounded-full p-1 ${
                      notification.type === "info"
                        ? "bg-blue-100 text-blue-600"
                        : notification.type === "success"
                          ? "bg-green-100 text-green-600"
                          : notification.type === "warning"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm">
                View all notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
