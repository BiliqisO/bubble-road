import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductGridProps {
  category?: string
}

export function ProductGrid({ category }: ProductGridProps) {
  // In a real app, this would be fetched from an API with filtering by category
  const products = [
    {
      id: "1",
      name: "Premium Digital Art Collection",
      price: "50 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "DigitalArtStudio",
      category: "Digital Art",
      type: "digital",
    },
    {
      id: "2",
      name: "Handcrafted Wooden Desk Organizer",
      price: "75 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "WoodWorkshop",
      category: "Home Goods",
      type: "physical",
    },
    {
      id: "3",
      name: "Professional Logo Design Service",
      price: "120 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "DesignPro",
      category: "Services",
      type: "services",
    },
    {
      id: "4",
      name: "Organic Skincare Bundle",
      price: "65 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "NaturalBeauty",
      category: "Beauty",
      type: "physical",
    },
    {
      id: "5",
      name: "Online Marketing Consultation",
      price: "200 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "MarketingGuru",
      category: "Services",
      type: "services",
    },
    {
      id: "6",
      name: "Exclusive Music Album",
      price: "25 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "IndieArtist",
      category: "Music",
      type: "digital",
    },
    {
      id: "7",
      name: "Handmade Ceramic Mug Set",
      price: "45 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "CeramicArtisan",
      category: "Home Goods",
      type: "physical",
    },
    {
      id: "8",
      name: "Digital Photography Course",
      price: "80 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "PhotoMaster",
      category: "Education",
      type: "digital",
    },
    {
      id: "9",
      name: "Artisanal Chocolate Box",
      price: "35 XION",
      image: "/placeholder.svg?height=400&width=400",
      seller: "ChocolatierDeluxe",
      category: "Food",
      type: "physical",
    },
  ]

  // Filter products by category if provided
  const filteredProducts = category ? products.filter((product) => product.type === category) : products

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
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
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}

