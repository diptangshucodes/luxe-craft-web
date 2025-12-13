import { useState, useRef, useEffect } from "react";
import { Upload, Crop, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function AdminImageUpload() {
  const { toast } = useToast();
  const [images, setImages] = useState<Array<{ filename: string; url: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [galleryDimensions, setGalleryDimensions] = useState({ width: 500, height: 500 });
  const [cropData, setCropData] = useState<CropData>({ x: 0, y: 0, width: 500, height: 500 });
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDraggingRef = useRef<string | null>(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchGalleryDimensions();
    fetchGalleryImages();
  }, []);

  const fetchGalleryDimensions = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:3001/api/admin/gallery-dimensions");
      if (!response.ok) throw new Error("Failed to fetch dimensions");
      const data = await response.json();
      setGalleryDimensions(data);
      setCropData({ x: 0, y: 0, width: data.width, height: data.height });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error fetching dimensions";
      console.error(errorMsg, error);
      setError(errorMsg);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:3001/api/gallery-images");
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      const data = await response.json();
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCropPreview = () => {
    if (!canvasRef.current || !imageRef.current || !preview) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;

    canvas.width = 600;
    canvas.height = 600;

    // Draw the image
    const scale = Math.min(600 / img.width, 600 / img.height);
    const x = (600 - img.width * scale) / 2;
    const y = (600 - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw the crop box
    const scaledCrop = {
      x: x + cropData.x * scale,
      y: y + cropData.y * scale,
      width: cropData.width * scale,
      height: cropData.height * scale,
    };

    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.strokeRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = "#FFD700";
    const corners = [
      { x: scaledCrop.x, y: scaledCrop.y },
      { x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y },
      { x: scaledCrop.x, y: scaledCrop.y + scaledCrop.height },
      { x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y + scaledCrop.height },
    ];

    corners.forEach((corner) => {
      ctx.fillRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
    });
  };

  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        drawCropPreview();
      };
      img.src = preview;
    }
  }, [preview, cropData]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (rect.width / 600);
    const mouseY = (e.clientY - rect.top) / (rect.height / 600);

    const scale = Math.min(600 / imageRef.current.width, 600 / imageRef.current.height);
    const x = (600 - imageRef.current.width * scale) / 2;
    const y = (600 - imageRef.current.height * scale) / 2;

    const scaledCrop = {
      x: x + cropData.x * scale,
      y: y + cropData.y * scale,
      width: cropData.width * scale,
      height: cropData.height * scale,
    };

    const handleSize = 8;
    const corners = [
      { name: "tl", x: scaledCrop.x, y: scaledCrop.y },
      { name: "tr", x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y },
      { name: "bl", x: scaledCrop.x, y: scaledCrop.y + scaledCrop.height },
      { name: "br", x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y + scaledCrop.height },
    ];

    for (const corner of corners) {
      if (
        Math.abs(mouseX - corner.x) < handleSize &&
        Math.abs(mouseY - corner.y) < handleSize
      ) {
        isDraggingRef.current = corner.name;
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current || !imageRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (rect.width / 600);
    const mouseY = (e.clientY - rect.top) / (rect.height / 600);

    const scale = Math.min(600 / imageRef.current.width, 600 / imageRef.current.height);
    const x = (600 - imageRef.current.width * scale) / 2;
    const y = (600 - imageRef.current.height * scale) / 2;

    const normalizedX = (mouseX - x) / scale;
    const normalizedY = (mouseY - y) / scale;

    const corner = isDraggingRef.current;
    const newCrop = { ...cropData };
    const fixedSize = galleryDimensions.width; // 500x500

    // Only allow moving, not resizing (maintain fixed dimensions)
    if (corner.includes("t")) {
      newCrop.y = Math.max(0, normalizedY);
    }
    if (corner.includes("b")) {
      newCrop.y = Math.max(0, normalizedY - fixedSize);
    }
    if (corner.includes("l")) {
      newCrop.x = Math.max(0, normalizedX);
    }
    if (corner.includes("r")) {
      newCrop.x = Math.max(0, normalizedX - fixedSize);
    }

    // Ensure crop box stays within image bounds
    if (newCrop.x + fixedSize > imageRef.current.width) {
      newCrop.x = imageRef.current.width - fixedSize;
    }
    if (newCrop.y + fixedSize > imageRef.current.height) {
      newCrop.y = imageRef.current.height - fixedSize;
    }

    newCrop.width = fixedSize;
    newCrop.height = fixedSize;

    setCropData(newCrop);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = null;
  };

  const handleCropSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("cropData", JSON.stringify(cropData));

      const response = await fetch("http://localhost:3001/api/admin/crop-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Image Uploaded!",
          description: "Your image has been added to the gallery",
        });
        setSelectedFile(null);
        setPreview("");
        setShowCrop(false);
        fetchGalleryImages();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/delete-image/${filename}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast({
          title: "Image Deleted",
          description: "Image has been removed from the gallery",
        });
        fetchGalleryImages();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container-custom max-w-4xl">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          Gallery Management
        </h1>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Upload Images</h2>

          {!showCrop ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-muted-foreground">
                Supported formats: JPG, PNG, WebP (Max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-black rounded-lg overflow-hidden inline-block">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="cursor-move"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleCropSubmit}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Crop size={20} />
                  {isLoading ? "Uploading..." : "Crop & Upload"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowCrop(false);
                    setSelectedFile(null);
                    setPreview("");
                  }}
                >
                  <X size={20} />
                  Cancel
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Drag the crop box to position it. Fixed size: {galleryDimensions.width}x{galleryDimensions.height}px (1:1 aspect ratio)
              </p>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Current Gallery</h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.filename} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`http://localhost:3001${image.url}`}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(image.filename)}
                    className="absolute top-2 right-2 p-2 bg-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No images in gallery yet. Upload your first image!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
