import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProductGallerySection } from "@/components/ProductGallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BulkOrderSection } from "@/components/BulkOrderSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductGallerySection />
      <TestimonialsSection />
      <BulkOrderSection />
      <Footer />
    </main>
  );
};

export default Index;
