"use client"

import { useAuth } from "@/context/authContext"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsers } from "@/context/usersContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const UserRolesManager = () => {

    const { isAdmin } = useAuth()
    const { users, changeRole, loading } = useUsers()

    if(!isAdmin()) return null

  return (
    <div className="mt-10">
      <div className="mb-10">
        <p className="font-semibold text-lg text-center">Admin</p>
        <p className="text-sm text-muted-foreground text-center">Här kan du ändra på användares behörigheter</p>
      </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Användarnamn</TableHead>
          <TableHead className="w-[180px] sm:w-auto">E-post</TableHead>
          <TableHead>Roll</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!users.length && users.map((user) => (
          <TableRow key={user.uid}>
            <TableCell>
              <p className="truncate w-[100px]">{user.displayName}</p>
            </TableCell>
            <TableCell>
              <p className="truncate w-[180px] sm:w-auto">{user.email }</p>
            </TableCell>
            <TableCell>
              <Badge className={user.role === "admin" && "bg-blue-600 text-white" }>
                { user.role  === "admin" ? "Admin" : "Användare" }
              </Badge>
            </TableCell>
            <TableCell className="text-wight">
              <Button 
              variant={user.role === "admin" ? "destructive" : "default"}
              size="sm"
              disabled={loading}
              onClick={() => changeRole(user.uid, user.role === "admin" ? "user" : "admin")}
              >
                {
                  loading
                    ? "Laddar..."
                    : user.role === "admin"
                      ? "Ta bort admin"
                      : "Gör till admin"
                }
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}