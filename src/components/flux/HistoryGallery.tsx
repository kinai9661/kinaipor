import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HistoryManager, type HistoryItem } from '@/lib/storage';
import { CONFIG } from '@/lib/flux-config';
import { Download, Trash2, RotateCcw, X, FileDown, Image as ImageIcon } from 'lucide-react';

interface HistoryGalleryProps {
  onReusePrompt?: (item: HistoryItem) => void;
}

export default function HistoryGallery({ onReusePrompt }: HistoryGalleryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, sizeKB: '0', recentStyle: '-' });

  const loadHistory = () => {
    const items = HistoryManager.getHistory();
    const statsData = HistoryManager.getStats();
    setHistory(items);
    setStats(statsData);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這條記錄嗎？')) {
      HistoryManager.deleteFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('確定要清空所有歷史記錄嗎？此操作不可恢復！')) {
      HistoryManager.clearHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    HistoryManager.exportHistory();
  };

  const handleDownloadImage = (url: string, seed: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `flux-ai-${seed}-${Date.now()}.png`;
    link.click();
  };

  const handleReuse = (item: HistoryItem) => {
    if (onReusePrompt) {
      onReusePrompt(item);
    }
  };

  const getStyleInfo = (styleKey: string) => {
    const style = CONFIG.STYLE_PRESETS[styleKey as keyof typeof CONFIG.STYLE_PRESETS];
    return style ? `${style.icon} ${style.name}` : styleKey;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 統計信息 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>📊 歷史統計</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                導出
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                清空
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">總記錄數</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.sizeKB} KB</div>
              <div className="text-sm text-muted-foreground">存儲空間</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.recentStyle}</div>
              <div className="text-sm text-muted-foreground">最近風格</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 圖片畫廊 */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">暫無歷史記錄</p>
            <p className="text-sm">生成的圖像會自動保存在這裡</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                <img
                  src={item.url}
                  alt="Generated"
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(item.url)}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedImage(item.url)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownloadImage(item.url, item.seed)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {item.model}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">
                    Seed: {item.seed}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-500 rounded">
                    {getStyleInfo(item.style)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.width}x{item.height} | {item.qualityMode || 'standard'}
                </div>
                {item.prompt && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.prompt}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReuse(item)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    重用
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownloadImage(item.url, item.seed)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    下載
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 圖片查看模態框 */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>圖片預覽</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
