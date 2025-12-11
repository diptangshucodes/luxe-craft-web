import { Award, Users, Globe, Leaf } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every piece is crafted from carefully selected full-grain leather, ensuring durability and beauty that lasts for decades.",
  },
  {
    icon: Users,
    title: "Expert Craftsmen",
    description:
      "Our artisans bring generations of expertise, combining traditional techniques with modern precision.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Serving clients worldwide with reliable shipping and dedicated customer support across time zones.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description:
      "Committed to ethical sourcing and eco-friendly tanning processes that protect our planet.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-muted/50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium tracking-widest text-sm uppercase">
            Our Story
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            About LeatherCraft Co.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            For over three decades, we've been at the forefront of leather manufacturing, 
            blending traditional craftsmanship with modern innovation. Our passion for 
            quality drives everything we do, from sourcing the finest materials to 
            delivering products that exceed expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 card-elegant group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "30+", label: "Years Experience" },
            { value: "500+", label: "Happy Clients" },
            { value: "10K+", label: "Products Delivered" },
            { value: "15", label: "Countries Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
