import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Fashion Boutique Owner",
    content:
      "LeatherCraft Co. has been our go-to supplier for three years. The quality is consistently exceptional, and their bulk order process is seamless. Our customers always compliment the leather goods.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Luxury Retail Director",
    content:
      "Working with LeatherCraft transformed our product line. Their attention to detail and commitment to quality is unmatched. Every piece tells a story of craftsmanship.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "E-commerce Entrepreneur",
    content:
      "From the first sample to our 500th order, the quality never wavered. Their team is responsive, professional, and truly understands the importance of consistency in manufacturing.",
    rating: 5,
  },
  {
    name: "Michael Foster",
    role: "Corporate Gifts Manager",
    content:
      "We've been ordering custom leather portfolios for our executive gifts. The personalization options and premium quality have made our corporate presents truly memorable.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium tracking-widest text-sm uppercase">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our valued partners
            have to say about working with us.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote size={80} className="text-primary" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-gold text-gold"
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-light">
              "{testimonials[currentIndex].content}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-primary">
                  {testimonials[currentIndex].name[0]}
                </span>
              </div>
              <div>
                <div className="font-semibold text-foreground text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-primary/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
