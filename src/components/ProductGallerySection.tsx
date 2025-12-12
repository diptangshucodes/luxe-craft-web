import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

import productBag1 from "@/assets/product-bag-1.jpg";
import productBag2 from "@/assets/product-bag-2.jpg";
import productWallet1 from "@/assets/product-wallet-1.jpg";
import productWallet2 from "@/assets/product-wallet-2.jpg";
import productBelt1 from "@/assets/product-belt-1.jpg";
import productBelt2 from "@/assets/product-belt-2.jpg";
import productAccessory1 from "@/assets/product-accessory-1.jpg";
import productAccessory2 from "@/assets/product-accessory-2.jpg";

type Category = "all" | "bags" | "wallets" | "belts" | "accessories";

interface Product {
  id: number;
  name: string;
  category: Category;
  image: string;
  price: string;
}

const products: Product[] = [
  { id: 1, name: "Executive Messenger Bag", category: "bags", image: productBag1, price: "$299" },
  { id: 2, name: "Classic Tote Bag", category: "bags", image: productBag2, price: "$259" },
  { id: 3, name: "Heritage Bifold Wallet", category: "wallets", image: productWallet1, price: "$89" },
  { id: 4, name: "Slim Cardholder", category: "wallets", image: productWallet2, price: "$59" },
  { id: 5, name: "Artisan Belt", category: "belts", image: productBelt1, price: "$129" },
  { id: 6, name: "Braided Leather Belt", category: "belts", image: productBelt2, price: "$149" },
  { id: 7, name: "Keychain & Card Set", category: "accessories", image: productAccessory1, price: "$69" },
  { id: 8, name: "Travel Essentials Set", category: "accessories", image: productAccessory2, price: "$119" },
];

const categories: { label: string; value: Category }[] = [
  { label: "All Products", value: "all" },
  { label: "Bags", value: "bags" },
  { label: "Wallets", value: "wallets" },
  { label: "Belts", value: "belts" },
  { label: "Accessories", value: "accessories" },
];

export const ProductGallerySection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

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
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.value)}
              className="transition-all duration-300"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
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
                      src={product.image}
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
                  <p className="text-primary font-semibold mt-1">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
