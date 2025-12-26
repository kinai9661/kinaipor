import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { processUploadedImage, type UploadedImage } from '@/lib/image-utils';

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  currentImages: UploadedImage[];
}

export default function ImageUpload({ onImagesChange, maxImages = 1, currentImages }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const newImages: UploadedImage[] = [];

      for (let i = 0; i < Math.min(files.length, maxImages - currentImages.length); i++) {
        const file = files[i];
        const processedImage = await processUploadedImage(file);
        newImages.push(processedImage);
      }

      onImagesChange([...currentImages, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    // Clean up preview URL
    if (currentImages[index]?.preview) {
      URL.revokeObjectURL(currentImages[index].preview);
    }
    onImagesChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canUploadMore = currentImages.length < maxImages;

  return (
    <div className="space-y-4">
      <div>
        <Label>參考圖像（圖生圖）</Label>
        <p className="text-xs text-muted-foreground mt-1">
          支持 Kontext 模型，最多 {maxImages} 張圖片
        </p>
      </div>

      {/* Upload Button */}
      {canUploadMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={maxImages > 1}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                上傳中...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                上傳參考圖像
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {currentImages.map((image, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={image.preview}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image.file.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      {currentImages.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">點擊上方按鈕上傳參考圖像</p>
            <p className="text-xs mt-1">支持 JPG, PNG, WebP, GIF</p>
            <p className="text-xs">最大 10MB</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
