import { useState } from "react";
import { Package, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const productCategories = [
  "Bags & Briefcases",
  "Wallets & Cardholders",
  "Belts & Accessories",
  "Journals & Portfolios",
  "Custom Products",
];

const quantityRanges = [
  "50-100 units",
  "100-500 units",
  "500-1000 units",
  "1000+ units",
];

export function BulkOrderSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productCategory: "",
    quantity: "",
    specifications: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/send-bulk-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bulk order');
      }

      toast({
        title: "Bulk Order Request Submitted!",
        description:
          "Our sales team will contact you within 24-48 hours with a custom quote.",
      });
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        productCategory: "",
        quantity: "",
        specifications: "",
      });
    } catch (error) {
      console.error('Error submitting bulk order:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="bulk-orders" className="section-padding bg-muted/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Info Section */}
          <div>
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              Wholesale & B2B
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Bulk Orders
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Partner with Kamala Trader for your wholesale leather product needs. 
              We offer competitive pricing, custom branding options, and dedicated 
              account management for bulk orders.
            </p>

            {/* Benefits */}
            <div className="space-y-6">
              {[
                {
                  title: "Custom Branding",
                  description:
                    "Add your logo, choose custom colors, and create products unique to your brand.",
                },
                {
                  title: "Volume Discounts",
                  description:
                    "Enjoy significant savings with tiered pricing based on order quantity.",
                },
                {
                  title: "Quality Assurance",
                  description:
                    "Every batch undergoes rigorous quality checks before shipping.",
                },
                {
                  title: "Flexible Timelines",
                  description:
                    "We work with your schedule to meet launch dates and seasonal demands.",
                },
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-lg card-elegant">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Request a Quote
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                  className="h-12 bg-background"
                />
                <Input
                  type="text"
                  placeholder="Contact Name"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  required
                  className="h-12 bg-background"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-12 bg-background"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-12 bg-background"
                />
              </div>

              <Select
                value={formData.productCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, productCategory: value })
                }
              >
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.quantity}
                onValueChange={(value) =>
                  setFormData({ ...formData, quantity: value })
                }
              >
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Estimated Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {quantityRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Product Specifications & Requirements"
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                rows={4}
                className="bg-background resize-none"
              />

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Send size={18} />
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
