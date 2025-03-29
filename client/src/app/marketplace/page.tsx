import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketplacePage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase products from verified sellers</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search products..." className="w-full md:w-[300px]" />
          <Button>Search</Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="hidden md:block">
              <ProductFilters />
            </div>
            <div className="md:col-span-3">
              <ProductGrid />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="digital" className="mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="hidden md:block">
              <ProductFilters />
            </div>
            <div className="md:col-span-3">
              <ProductGrid category="digital" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="physical" className="mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="hidden md:block">
              <ProductFilters />
            </div>
            <div className="md:col-span-3">
              <ProductGrid category="physical" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="hidden md:block">
              <ProductFilters />
            </div>
            <div className="md:col-span-3">
              <ProductGrid category="services" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

