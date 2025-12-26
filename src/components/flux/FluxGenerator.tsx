import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { PollinationsClient } from '@/lib/api-client';
import { HistoryManager, type HistoryItem } from '@/lib/storage';
import { CONFIG, type Model, type Style, type SizePreset } from '@/lib/flux-config';
import { Loader2, Sparkles } from 'lucide-react';

interface FluxGeneratorProps {
  reuseData?: HistoryItem | null;
}

export default function FluxGenerator({ reuseData }: FluxGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<Model>('zimage');
  const [style, setStyle] = useState<Style>('none');
  const [sizePreset, setSizePreset] = useState<SizePreset>('square-1k');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState(-1);
  const [numOutputs, setNumOutputs] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; seed: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  // 重用數據
  useEffect(() => {
    if (reuseData) {
      setPrompt(reuseData.prompt || '');
      setModel(reuseData.model as Model);
      setStyle(reuseData.style as Style);
      setSeed(reuseData.seed);
      setNegativePrompt(reuseData.negativePrompt || '');
      
      // 嘗試匹配尺寸
      const matchedSize = Object.entries(CONFIG.PRESET_SIZES).find(
        ([_, size]) => size.width === reuseData.width && size.height === reuseData.height
      );
      if (matchedSize) {
        setSizePreset(matchedSize[0] as SizePreset);
      }
    }
  }, [reuseData]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('請輸入提示詞');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const sizeConfig = CONFIG.PRESET_SIZES[sizePreset];
      const client = new PollinationsClient();
      
      const results = await client.generate({
        prompt,
        model,
        width: sizeConfig.width,
        height: sizeConfig.height,
        style,
        seed,
        negativePrompt,
        numOutputs
      });

      setGeneratedImages(results.map(r => ({ url: r.url, seed: r.seed })));

      // 保存到歷史
      results.forEach(result => {
        HistoryManager.addToHistory({
          ...result,
          prompt,
          negativePrompt,
          qualityMode: 'standard'
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失敗');
    } finally {
      setIsGenerating(false);
    }
  };

  const styleConfig = CONFIG.STYLE_PRESETS[style];
  const sizeConfig = CONFIG.PRESET_SIZES[sizePreset];

  // 按分類組織風格
  const stylesByCategory = Object.entries(CONFIG.STYLE_PRESETS).reduce((acc, [key, value]) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push({ key, ...value });
    return acc;
  }, {} as Record<string, Array<{ key: string; name: string; icon: string }>>);

  const sortedCategories = Object.entries(CONFIG.STYLE_CATEGORIES).sort(
    (a, b) => a[1].order - b[1].order
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* 左側：生成參數 */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ 生成參數</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>模型選擇</Label>
            <Select value={model} onValueChange={(v) => setModel(v as Model)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONFIG.PROVIDERS.pollinations.models.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {CONFIG.PROVIDERS.pollinations.models.find(m => m.id === model)?.description}
            </p>
          </div>

          <div>
            <Label>尺寸預設</Label>
            <Select value={sizePreset} onValueChange={(v) => setSizePreset(v as SizePreset)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONFIG.PRESET_SIZES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {sizeConfig.width}x{sizeConfig.height}
            </p>
          </div>

          <div>
            <Label>藝術風格 ({Object.keys(CONFIG.STYLE_PRESETS).length} 種)</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortedCategories.map(([catKey, catInfo]) => (
                  <SelectGroup key={catKey}>
                    <SelectLabel>{catInfo.icon} {catInfo.name}</SelectLabel>
                    {stylesByCategory[catKey]?.map(s => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.icon} {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {styleConfig && (
              <p className="text-xs text-purple-500 mt-1">
                {styleConfig.icon} {styleConfig.name}
              </p>
            )}
          </div>

          <div>
            <Label>Seed (-1 = 隨機)</Label>
            <Input 
              type="number" 
              value={seed} 
              onChange={(e) => setSeed(parseInt(e.target.value))}
              min={-1}
              max={999999}
            />
          </div>

          <div>
            <Label>生成數量</Label>
            <Input 
              type="number" 
              value={numOutputs} 
              onChange={(e) => setNumOutputs(parseInt(e.target.value))}
              min={1}
              max={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                開始生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 中間：結果顯示 */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>🖼️ 生成結果</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              <strong>錯誤：</strong> {error}
            </div>
          )}
          
          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">正在生成圖像，請稍候...</p>
            </div>
          )}

          {!isGenerating && generatedImages.length === 0 && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <p>尚未生成任何圖像</p>
              <p className="text-sm mt-2">填寫參數並輸入提示詞後點擊生成</p>
            </div>
          )}

          <div className="space-y-4">
            {generatedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={img.url} 
                  alt={`Generated ${idx + 1}`}
                  className="w-full rounded-lg border"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Seed: {img.seed}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 右側：提示詞 */}
      <Card>
        <CardHeader>
          <CardTitle>💬 提示詞</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>正面提示詞</Label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想生成的圖像...

例如：
• A beautiful sunset over mountains
• 一隻可愛的貓咆在花園裡玩耶
• Cyberpunk city at night"
              rows={8}
              className="font-mono"
            />
            <p className="text-xs text-green-500 mt-1">✅ 支持中文</p>
          </div>

          <div>
            <Label>負面提示詞 (可選)</Label>
            <Textarea 
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="描述不想要的內容...

例如：
blurry, low quality, distorted"
              rows={4}
              className="font-mono"
            />
          </div>

          <div className="bg-purple-500/10 border border-purple-500 rounded p-3">
            <p className="text-sm font-semibold mb-1">🎨 當前風格</p>
            <p className="text-sm">{styleConfig.icon} {styleConfig.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{styleConfig.description}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
            <p className="text-sm font-semibold mb-1">📋 當前配置</p>
            <p className="text-xs">模型：{CONFIG.PROVIDERS.pollinations.models.find(m => m.id === model)?.name}</p>
            <p className="text-xs">尺寸：{sizeConfig.name}</p>
            <p className="text-xs">風格：{styleConfig.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
