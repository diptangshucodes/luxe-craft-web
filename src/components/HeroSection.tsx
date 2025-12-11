import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", message: "" });
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

          {/* Contact Form */}
          <div id="contact" className="bg-card rounded-2xl p-8 lg:p-10 shadow-lg card-elegant">
            <div className="mb-8">
              <span className="text-gold font-medium tracking-widest text-sm uppercase">
                Get in Touch
              </span>
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Contact Us
              </h3>
              <p className="text-muted-foreground mt-3">
                Have questions about our leather products? We'd love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-12 bg-background border-border focus:border-primary"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-12 bg-background border-border focus:border-primary"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="bg-background border-border focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Send size={18} />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
