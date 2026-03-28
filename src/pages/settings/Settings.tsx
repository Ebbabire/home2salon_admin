import { getSession } from "@/services/session"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChangePasswordTab } from "./change-password-tab"
import { AdvancePaymentTab } from "./advance-payment-tab"

export const Settings = () => {
  const { userRole } = getSession()
  const isSuperAdmin = userRole === "superadmin"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin settings</CardTitle>
        <CardDescription>
          Update your password or configure advance payment rules.
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto max-w-4xl">
        <Tabs defaultValue="password" className="w-full">
          <TabsList
            className={cn(
              "h-auto min-h-10 w-full flex-wrap justify-start gap-1 sm:max-w-xl",
              isSuperAdmin && "sm:grid sm:grid-cols-2"
            )}
          >
            <TabsTrigger value="password">Change password</TabsTrigger>
            {isSuperAdmin ? (
              <TabsTrigger value="advance">Advance payment</TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value="password" className="mt-0 border-0 shadow-none">
            <ChangePasswordTab />
          </TabsContent>
          {isSuperAdmin ? (
            <TabsContent value="advance" className="mt-0 border-0 shadow-none">
              <AdvancePaymentTab />
            </TabsContent>
          ) : null}
        </Tabs>
      </CardContent>
    </Card>
  )
}
