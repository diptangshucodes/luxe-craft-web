import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  image_filename: string;
  price: number;
  description: string;
}

const categories = [
  "Bags & Briefcases",
  "Wallets & Cardholders",
  "Belts & Accessories",
  "Journals & Portfolios",
  "Custom Products",
];

export const ProductGallerySection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            Our Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-3 mb-4">
            Premium Leather Goods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each piece is meticulously handcrafted using traditional techniques and the finest full-grain leather
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
            className="transition-all duration-300"
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="transition-all duration-300"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg bg-card shadow-lg">
                    {/* Image Container */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${API_URL}/uploads/${product.image_filename}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <button className="w-12 h-12 rounded-full bg-background flex items-center justify-center transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-background flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full capitalize">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-primary font-semibold mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
