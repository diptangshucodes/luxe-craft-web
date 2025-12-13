import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage1 from "@/assets/hero-leather-1.jpg";
import heroImage2 from "@/assets/hero-leather-2.jpg";
import heroImage3 from "@/assets/hero-leather-3.jpg";

const slides = [
  {
    image: heroImage1,
    title: "Crafted with Passion",
    subtitle: "Premium leather goods handcrafted by skilled artisans",
  },
  {
    image: heroImage2,
    title: "Timeless Elegance",
    subtitle: "Luxury leather products that stand the test of time",
  },
  {
    image: heroImage3,
    title: "Quality Materials",
    subtitle: "Sourcing only the finest Italian and full-grain leathers",
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_filename: string;
  description: string;
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-20">
      <div className="container-custom h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
          {/* Carousel */}
          <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-2 animate-fade-up">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-primary-foreground/90 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-gold w-6"
                      : "bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="space-y-6">
            <div>
              <span className="text-gold font-medium tracking-widest text-sm uppercase">
                Featured Collection
              </span>
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Premium Leather Goods
              </h3>
              <p className="text-muted-foreground mt-3">
                Discover our handcrafted selection of premium leather products, each piece a masterpiece of quality and elegance.
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 2).map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/${product.image_filename}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f5f5f5' width='100' height='100'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-bold text-primary">₹{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="w-full" onClick={() => {
              const element = document.querySelector("#products");
              element?.scrollIntoView({ behavior: "smooth" });
            }}>
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
