import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminImageUpload } from "@/components/AdminImageUpload";
import { AdminProductManagement } from "@/components/AdminProductManagement";
import { AdminEmailSettings } from "@/components/AdminEmailSettings";
import { AdminContactSettings } from "@/components/AdminContactSettings";
import { LogOut } from "lucide-react";

type Tab = "gallery" | "products" | "email" | "contact";

const AdminUpload = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-md border-b border-border sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom py-8">
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "gallery"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Collection Gallery
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "email"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Email Settings
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "contact"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Contact Details
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && <AdminProductManagement />}
        {activeTab === "gallery" && <AdminImageUpload />}
        {activeTab === "email" && <AdminEmailSettings />}
        {activeTab === "contact" && <AdminContactSettings />}
      </div>
    </div>
  );
};

export default AdminUpload;
