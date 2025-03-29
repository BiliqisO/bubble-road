"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PurchaseOptionsProps {
  productId: string
  price: string
}

export function PurchaseOptions({ productId, price }: PurchaseOptionsProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    // In a real app, this would connect to a blockchain wallet
    setIsWalletConnected(true)
  }

  const handlePurchase = () => {
    // In a real app, this would initiate a blockchain transaction
    alert("Purchase initiated! In a real app, this would create a transaction on the XION blockchain.")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="crypto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">XION Payment</TabsTrigger>
            <TabsTrigger value="fiat">Credit Card</TabsTrigger>
          </TabsList>
          <TabsContent value="crypto" className="mt-4 space-y-4">
            {!isWalletConnected ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Connect your wallet to purchase with XION tokens</p>
                <Button onClick={handleConnectWallet}>Connect Wallet</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price:</span>
                  <span className="font-medium">{price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network Fee:</span>
                  <span className="font-medium text-green-600">0 XION</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{price}</span>
                </div>
                <Button className="w-full" onClick={handlePurchase}>
                  Buy Now
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your purchase is secured by the XION blockchain
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="fiat" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Price:</span>
                <span className="font-medium">$25.00 USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Processing Fee:</span>
                <span className="font-medium">$1.25 USD</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold">$26.25 USD</span>
              </div>
              <Button className="w-full" variant="outline">
                Checkout with Credit Card
              </Button>
              <p className="text-xs text-muted-foreground text-center">Secure payment processing via Stripe</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

