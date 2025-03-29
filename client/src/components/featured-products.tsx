import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function FeaturedProducts() {
  // In a real app, this would be fetched from an API
  const products = [
    {
      id: "1",
      name: "Premium Digital Art Collection",
      price: "50 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "DigitalArtStudio",
      category: "Digital Art",
    },
    {
      id: "2",
      name: "Handcrafted Wooden Desk Organizer",
      price: "75 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "WoodWorkshop",
      category: "Home Goods",
    },
    {
      id: "3",
      name: "Professional Logo Design Service",
      price: "120 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "DesignPro",
      category: "Services",
    },
    {
      id: "4",
      name: "Organic Skincare Bundle",
      price: "65 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "NaturalBeauty",
      category: "Beauty",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">{product.category}</div>
            <h3 className="font-medium mt-1 line-clamp-1">{product.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="font-bold">{product.price}</div>
              <div className="text-xs text-muted-foreground">by {product.seller}</div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/product/${product.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Product
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

