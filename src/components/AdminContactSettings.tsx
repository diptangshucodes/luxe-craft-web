import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactDetails {
  id: number;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
}

export function AdminContactSettings() {
  const { toast } = useToast();
  const [details, setDetails] = useState<Partial<ContactDetails>>({
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    whatsapp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:3001/api/contact-details");
      if (!response.ok) throw new Error("Failed to fetch contact details");
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error fetching contact details";
      console.error(errorMsg, error);
      setError(errorMsg);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!details.address || !details.phone || !details.email) {
        toast({
          title: "Error",
          description: "Address, phone, and email are required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3001/api/admin/contact-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contact details updated successfully",
        });
        fetchContactDetails();
      } else {
        throw new Error("Failed to update details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update contact details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Contact Information Section */}
      <div className="bg-card rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Contact Details */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Primary Contact Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </label>
                <Textarea
                  name="address"
                  placeholder="Enter business address"
                  value={details.address || ""}
                  onChange={handleInputChange}
                  required
                  className="h-24 bg-background"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+91 1234567890"
                    value={details.phone || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="info@company.com"
                    value={details.email || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Social Media Links</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Facebook size={16} />
                  Facebook
                </label>
                <Input
                  type="url"
                  name="facebook"
                  placeholder="https://facebook.com/..."
                  value={details.facebook || ""}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Instagram size={16} />
                  Instagram
                </label>
                <Input
                  type="url"
                  name="instagram"
                  placeholder="https://instagram.com/..."
                  value={details.instagram || ""}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Twitter size={16} />
                  Twitter
                </label>
                <Input
                  type="url"
                  name="twitter"
                  placeholder="https://twitter.com/..."
                  value={details.twitter || ""}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Linkedin size={16} />
                  LinkedIn
                </label>
                <Input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/..."
                  value={details.linkedin || ""}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle size={16} />
                  WhatsApp
                </label>
                <Input
                  type="url"
                  name="whatsapp"
                  placeholder="https://wa.me/919876543210"
                  value={details.whatsapp || ""}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Contact Details"}
          </Button>
        </form>
      </div>
    </div>
  );
}
