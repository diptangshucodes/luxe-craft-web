import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  filename: string;
  url: string;
}

export function CollectionGallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery-images`);
      const data = await response.json();
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items;

  const scrollToQuote = () => {
    const element = document.querySelector("#bulk-orders");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="collection" className="py-24 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold font-medium tracking-widest text-sm uppercase">
            Our Collection
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Premium Leather Artistry
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Explore our handcrafted collection of premium leather goods. Each piece represents the pinnacle of craftsmanship and quality.
          </p>
        </div>



        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.filename}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-card shadow-lg">
                    {/* Image Container */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${API_URL}${item.url}`}
                        alt={item.filename}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <p className="text-muted-foreground">No images in gallery yet.</p>
          </div>
        )}

        {/* Get Quote CTA */}
        <div className="text-center">
          <Button
            variant="hero"
            size="lg"
            onClick={scrollToQuote}
            className="gap-2"
          >
            <Quote size={20} />
            Get Quote for Bulk Orders
          </Button>
        </div>
      </div>
    </section>
  );
}
