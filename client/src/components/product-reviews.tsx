import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  // In a real app, this would be fetched from an API based on the product ID
  const reviews = [
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      rating: 5,
      date: "March 10, 2023",
      content:
        "Absolutely love this digital art collection! The quality is outstanding and the blockchain verification gives me peace of mind about authenticity.",
    },
    {
      id: "2",
      user: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SM",
      },
      rating: 4,
      date: "February 28, 2023",
      content:
        "Great collection with beautiful artwork. The only reason I'm giving 4 stars instead of 5 is because I wish there were more pieces included.",
    },
    {
      id: "3",
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      rating: 5,
      date: "February 15, 2023",
      content:
        "The artist commentary that comes with this collection adds so much value. I appreciate learning about the creative process behind each piece.",
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Customer Reviews</h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.user.name}</div>
                <div className="text-xs text-muted-foreground">{review.date}</div>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < review.rating ? "currentColor" : "none"}
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
            <p className="text-sm">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

