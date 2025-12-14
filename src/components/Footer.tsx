import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-charcoal text-primary-foreground">
      <div className="container-custom section-padding pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-serif text-2xl font-bold">Kamala Trader</span>
                <span className="text-gold text-sm font-medium tracking-widest uppercase">
                  Co.
                </span>
              </div>
              <p className="text-xs text-primary-foreground/60">GST: 27AABCT1234H1Z0</p>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Crafting premium leather goods with passion and precision since 1990. 
              Quality you can feel, elegance you can see.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About Us", "Testimonials", "Bulk Orders", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-primary-foreground/70 hover:text-gold transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {[
                "Leather Bags",
                "Wallets",
                "Belts",
                "Accessories",
                "Custom Orders",
              ].map((product) => (
                <li key={product}>
                  <a
                    href="#"
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold flex-shrink-0 mt-1" />
                <span className="text-primary-foreground/70">
                  123 Artisan Lane, Leather District
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gold flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gold flex-shrink-0" />
                <a
                  href="mailto:info@kamaltrader.com"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  info@kamaltrader.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {currentYear} Kamala Trader. All rights reserved. Developed by Diptangshu Dolui.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-primary-foreground/50 hover:text-gold text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-primary-foreground/50 hover:text-gold text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
