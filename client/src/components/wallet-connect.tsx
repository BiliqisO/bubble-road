"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState("0")

  const handleConnect = () => {
    // In a real app, this would connect to a blockchain wallet
    setIsConnected(true)
    setBalance("250")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setBalance("0")
  }

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} variant="outline" size="sm">
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>{balance} XION</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="flex justify-between w-full">
            <span>Balance:</span>
            <span className="font-medium">{balance} XION</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex justify-between w-full">
            <span>Address:</span>
            <span className="font-mono text-xs">xion1...4f8a</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View Transactions</DropdownMenuItem>
        <DropdownMenuItem>Send XION</DropdownMenuItem>
        <DropdownMenuItem>Receive XION</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

