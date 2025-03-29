import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductReviews } from "@/components/product-reviews"
import { SellerInfo } from "@/components/seller-info"
import { PurchaseOptions } from "@/components/purchase-options"

export default function ProductPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch product data based on the ID
  const product = {
    id: params.id,
    name: "Premium Digital Art Collection",
    price: "50 XION",
    description:
      "A collection of 10 unique digital art pieces created by renowned digital artists. Each piece is authenticated on the XION blockchain with proof of ownership.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    seller: {
      name: "DigitalArtStudio",
      rating: 4.8,
      sales: 156,
      verified: true,
    },
    category: "Digital Art",
    tags: ["art", "digital", "collection", "nft"],
    rating: 4.7,
    reviews: 24,
  }

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-foreground">
          Marketplace
        </Link>
        <span>/</span>
        <Link href={`/marketplace?category=${product.category}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{product.price}</div>
            <div className="text-sm text-muted-foreground">Approximately $25.00 USD</div>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Link key={tag} href={`/marketplace?tag=${tag}`}>
                <Button variant="outline" size="sm">
                  #{tag}
                </Button>
              </Link>
            ))}
          </div>
          <PurchaseOptions productId={product.id} price={product.price} />
          <Card>
            <CardContent className="p-4">
              <SellerInfo seller={product.seller} />
            </CardContent>
          </Card>
        </div>
      </div>
      <Tabs defaultValue="details" className="mt-12">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Info</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4 space-y-4">
          <h3 className="text-xl font-bold">Product Details</h3>
          <p>
            This premium digital art collection features 10 unique pieces created by renowned digital artists from
            around the world. Each piece has been carefully curated and authenticated on the XION blockchain, providing
            irrefutable proof of ownership.
          </p>
          <p>When you purchase this collection, you'll receive:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>10 high-resolution digital art pieces</li>
            <li>Blockchain certificate of authenticity</li>
            <li>Exclusive access to artist commentary</li>
            <li>Future airdrops from participating artists</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <ProductReviews productId={product.id} />
        </TabsContent>
        <TabsContent value="blockchain" className="mt-4 space-y-4">
          <h3 className="text-xl font-bold">Blockchain Information</h3>
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Token ID</span>
              <code className="rounded bg-muted px-2 py-1 text-sm">xion1234567890abcdef</code>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Contract Address</span>
              <code className="rounded bg-muted px-2 py-1 text-sm">0x1234567890abcdef1234567890abcdef12345678</code>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Creator Royalty</span>
              <span>5%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Creation Date</span>
              <span>March 15, 2023</span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View on XION Explorer
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

