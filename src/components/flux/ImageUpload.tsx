import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
}

export default function ImageUpload({ onImagesChange, maxImages = 1, currentImages = [] }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const maxAllowed = maxImages - uploadedImages.length;

    for (let i = 0; i < Math.min(files.length, maxAllowed); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      // 轉換為 Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          newImages.push(dataUrl);
          
          if (newImages.length === Math.min(files.length, maxAllowed)) {
            const updated = [...uploadedImages, ...newImages];
            setUploadedImages(updated);
            onImagesChange(updated);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    onImagesChange(updated);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* 上傳區域 */}
      {uploadedImages.length < maxImages && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">點擊或拖拽圖片到此處</p>
          <p className="text-xs text-muted-foreground">
            支持 JPG, PNG, WebP | 最多 {maxImages} 張
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* 已上傳圖片預覽 */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {uploadedImages.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          已上傳 {uploadedImages.length} / {maxImages} 張
        </p>
      )}
    </div>
  );
}
