import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
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

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_filename: string;
  description: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export function AdminProductManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("adminToken");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setError("");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load products";
      console.error("Error fetching products:", error);
      setError(errorMsg);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.price || !formData.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!editingId && !selectedFile) {
        toast({
          title: "Error",
          description: "Please select an image",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (editingId) {
        // Update product
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(
          `${API_URL}/api/admin/products/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name,
              price: formData.price,
              category: formData.category,
              description: formData.description,
            }),
          }
        );

        if (response.ok) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
          fetchProducts();
          resetForm();
        } else {
          throw new Error("Update failed");
        }
      } else {
        // Create new product
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("description", formData.description);
        if (selectedFile) {
          formDataToSend.append("image", selectedFile);
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/admin/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Product created successfully",
          });
          fetchProducts();
          resetForm();
        } else {
          throw new Error("Creation failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: editingId ? "Failed to update product" : "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
    });
    setEditingId(product.id);
    setShowForm(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    setPreview(`${API_URL}/uploads/${product.image_filename}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchProducts();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", description: "" });
    setSelectedFile(null);
    setPreview("");
    setEditingId(null);
    setShowForm(false);
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

      {/* Add/Edit Product Form */}
      <div className="bg-card rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>
          {showForm && (
            <button
              onClick={resetForm}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!showForm ? (
          <Button variant="hero" size="lg" onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={20} />
            Add New Product
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Image
              </label>
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setSelectedFile(null);
                      }}
                      className="absolute top-1 right-1 p-1 bg-destructive rounded-lg text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <p className="text-muted-foreground">Click to upload image</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={editingId !== null}
              />
            </div>

            {/* Product Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g., Executive Messenger Bag"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-10 bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price *
                </label>
                <Input
                  type="number"
                  name="price"
                  placeholder="299.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  className="h-10 bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-10 bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Product description..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="bg-background resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="hero" disabled={isLoading} className="gap-2">
                <Save size={20} />
                {isLoading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Products List */}
      <div className="bg-card rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Products</h2>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/${product.image_filename}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-primary/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No products yet.</p>
        )}
      </div>
    </div>
  );
}
