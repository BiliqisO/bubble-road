import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SellerInfoProps {
  seller: {
    name: string
    rating: number
    sales: number
    verified: boolean
  }
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Seller: {seller.name}</h3>
          {seller.verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              Verified
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={i < Math.floor(seller.rating) ? "currentColor" : "none"}
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
          <span>{seller.rating}</span>
        </div>
        <div className="text-muted-foreground">{seller.sales} sales</div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="w-full">
          View Store
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Contact
        </Button>
      </div>
    </div>
  )
}

