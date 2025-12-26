import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  supportedModels?: string[];
  currentModel?: string;
}

export default function ImageUploader({ 
  onImagesChange, 
  maxImages = 1,
  supportedModels = ['kontext'],
  currentModel = 'zimage'
}: ImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSupported = supportedModels.includes(currentModel);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, maxImages - imageUrls.length); i++) {
        const file = files[i];
        
        // 檢查文件類型
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} 不是圖片文件`);
          continue;
        }

        // 檢查文件大小 (5MB 限制)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} 超過 5MB 限制`);
          continue;
        }

        // 轉換為 base64
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newUrls.push(base64);
      }

      const updatedUrls = [...imageUrls, ...newUrls].slice(0, maxImages);
      setImageUrls(updatedUrls);
      onImagesChange(updatedUrls);
    } catch (err) {
      setError('上傳失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  }, [imageUrls, maxImages, onImagesChange]);

  const handleUrlAdd = useCallback(() => {
    if (!urlInput.trim()) return;

    setError(null);

    try {
      new URL(urlInput); // 驗證 URL
      
      if (imageUrls.length >= maxImages) {
        setError(`最多只能上傳 ${maxImages} 張圖片`);
        return;
      }

      const updatedUrls = [...imageUrls, urlInput];
      setImageUrls(updatedUrls);
      onImagesChange(updatedUrls);
      setUrlInput('');
    } catch {
      setError('無效的 URL 格式');
    }
  }, [urlInput, imageUrls, maxImages, onImagesChange]);

  const handleRemove = useCallback((index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    onImagesChange(updatedUrls);
  }, [imageUrls, onImagesChange]);

  const handleClearAll = useCallback(() => {
    setImageUrls([]);
    onImagesChange([]);
    setError(null);
  }, [onImagesChange]);

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">當前模型不支持圖生圖</p>
            <p className="text-xs mt-1">
              支持的模型：{supportedModels.join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label>🖼️ 參考圖像 ({imageUrls.length}/{maxImages})</Label>
          {imageUrls.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              清空
            </Button>
          )}
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* 上傳按鈕 */}
        {imageUrls.length < maxImages && (
          <div className="space-y-3">
            <div>
              <Input
                type="file"
                accept="image/*"
                multiple={maxImages > 1}
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    上傳圖片 (5MB 以內)
                  </div>
                </Button>
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="輸入圖片 URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlAdd}
                disabled={!urlInput.trim()}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 圖片預覽 */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          ℹ️ 支持 JPG, PNG, WebP 格式，單張最大 5MB
        </p>
      </CardContent>
    </Card>
  );
}
