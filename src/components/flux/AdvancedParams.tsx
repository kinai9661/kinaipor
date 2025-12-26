import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface AdvancedParamsProps {
  qualityMode: 'economy' | 'standard' | 'ultra';
  onQualityModeChange: (mode: 'economy' | 'standard' | 'ultra') => void;
  guidanceScale: number;
  onGuidanceScaleChange: (value: number) => void;
  steps: number;
  onStepsChange: (value: number) => void;
  autoOptimize: boolean;
  onAutoOptimizeChange: (value: boolean) => void;
  autoHD: boolean;
  onAutoHDChange: (value: boolean) => void;
}

export default function AdvancedParams({
  qualityMode,
  onQualityModeChange,
  guidanceScale,
  onGuidanceScaleChange,
  steps,
  onStepsChange,
  autoOptimize,
  onAutoOptimizeChange,
  autoHD,
  onAutoHDChange
}: AdvancedParamsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          進階參數
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 質量模式 */}
        <div>
          <Label>質量模式</Label>
          <Select value={qualityMode} onValueChange={(v: any) => onQualityModeChange(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">
                <div className="flex flex-col items-start">
                  <span>💰 經濟模式</span>
                  <span className="text-xs text-muted-foreground">快速生成，較低質量</span>
                </div>
              </SelectItem>
              <SelectItem value="standard">
                <div className="flex flex-col items-start">
                  <span>⭐ 標準模式</span>
                  <span className="text-xs text-muted-foreground">平衡速度與質量</span>
                </div>
              </SelectItem>
              <SelectItem value="ultra">
                <div className="flex flex-col items-start">
                  <span>💎 超高清模式</span>
                  <span className="text-xs text-muted-foreground">極致質量，較慢速度</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {qualityMode === 'economy' && '適合快速測試和預覽'}
            {qualityMode === 'standard' && '推薦日常使用'}
            {qualityMode === 'ultra' && '適合最終成品和印刷'}
          </p>
        </div>

        {/* Guidance Scale */}
        <div>
          <Label className="flex justify-between">
            <span>Guidance Scale</span>
            <span className="text-muted-foreground">{guidanceScale}</span>
          </Label>
          <Input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={guidanceScale}
            onChange={(e) => onGuidanceScaleChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            控制提示詞的影響強度 (低: 更自由 | 高: 更精確)
          </p>
        </div>

        {/* Steps */}
        <div>
          <Label className="flex justify-between">
            <span>生成步驟</span>
            <span className="text-muted-foreground">{steps}</span>
          </Label>
          <Input
            type="range"
            min={4}
            max={50}
            step={1}
            value={steps}
            onChange={(e) => onStepsChange(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            更多步驟 = 更高質量，但速度更慢
          </p>
        </div>

        {/* 自動優化開關 */}
        <div className="space-y-2 pt-2 border-t">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">自動優化參數</span>
            <input
              type="checkbox"
              checked={autoOptimize}
              onChange={(e) => onAutoOptimizeChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            根據模型和尺寸自動調整參數
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">自動 HD 增強</span>
            <input
              type="checkbox"
              checked={autoHD}
              onChange={(e) => onAutoHDChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            自動添加高清優化提示詞
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
