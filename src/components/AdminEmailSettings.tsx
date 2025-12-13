import { useState, useEffect } from "react";
import { Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EmailConfig {
  email_user: string;
  email_password: string;
  email_host: string;
  email_port: number;
  recipient_email: string;
}

export function AdminEmailSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<EmailConfig>({
    email_user: "",
    email_password: "",
    email_host: "smtp.gmail.com",
    email_port: 587,
    recipient_email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const fetchEmailConfig = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:3001/api/admin/email-config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch email config");
      const data = await response.json();
      setConfig((prev) => ({ ...prev, ...data }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error fetching email config";
      console.error(errorMsg, error);
      setError(errorMsg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: name === "email_port" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!config.email_user || !config.email_host || !config.email_port || !config.recipient_email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3001/api/admin/email-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email settings updated successfully",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update email settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Email Settings</h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> These settings are used for sending emails from contact forms and bulk order requests.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address (From) *
            </label>
            <Input
              type="email"
              name="email_user"
              placeholder="your-email@gmail.com"
              value={config.email_user}
              onChange={handleInputChange}
              required
              className="h-10 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Gmail: Use your Gmail address</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              App Password *
            </label>
            <Input
              type="password"
              name="email_password"
              placeholder="Your app-specific password"
              value={config.email_password}
              onChange={handleInputChange}
              className="h-10 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gmail: Get from{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                myaccount.google.com/apppasswords
              </a>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Host *
            </label>
            <Input
              type="text"
              name="email_host"
              placeholder="smtp.gmail.com"
              value={config.email_host}
              onChange={handleInputChange}
              required
              className="h-10 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Gmail: smtp.gmail.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Port *
            </label>
            <Input
              type="number"
              name="email_port"
              placeholder="587"
              value={config.email_port}
              onChange={handleInputChange}
              required
              className="h-10 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Gmail: 587 (TLS) or 465 (SSL)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Recipient Email Address *
          </label>
          <Input
            type="email"
            name="recipient_email"
            placeholder="diptangshudo@gmail.com"
            value={config.recipient_email}
            onChange={handleInputChange}
            required
            className="h-10 bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Where to receive contact and bulk order form submissions
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Gmail Setup Instructions:
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Enable 2-Factor Authentication on your Gmail account</li>
            <li>Visit https://myaccount.google.com/apppasswords</li>
            <li>Select "Mail" and "Windows Computer"</li>
            <li>Copy the 16-character password and paste it above</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="hero" disabled={isLoading} className="gap-2">
            <Save size={20} />
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
