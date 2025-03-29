import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-0" />
      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Decentralized Commerce on XION
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                Buy and sell products with zero gas fees on the XION blockchain.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/marketplace">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/sellers/register">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                  Become a Seller
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Zero Gas Fees</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Verified Sellers</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px]">
              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] md:h-[350px] md:w-[350px] rounded-xl bg-background p-4 shadow-xl">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-lg bg-primary/10 backdrop-blur-sm" />
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-lg bg-primary/10 backdrop-blur-sm" />
                  <div className="relative h-full w-full rounded-lg border bg-background p-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20" />
                        <span className="font-medium">XION Market</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Connected</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-12 rounded-lg bg-muted p-2 flex items-center justify-between">
                        <span className="text-sm">Balance:</span>
                        <span className="font-medium">250 XION</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-20 rounded-lg bg-muted p-2 flex flex-col justify-between">
                          <span className="text-xs text-muted-foreground">Send</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto text-primary"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                        </div>
                        <div className="h-20 rounded-lg bg-muted p-2 flex flex-col justify-between">
                          <span className="text-xs text-muted-foreground">Receive</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto text-primary"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m8 12 4 4 4-4" />
                            <path d="M12 8v8" />
                          </svg>
                        </div>
                      </div>
                      <div className="h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <span className="font-medium">Shop Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

