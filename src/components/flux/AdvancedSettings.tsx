import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedSettingsProps {
  qualityMode: 'economy' | 'standard' | 'ultra';
  onQualityModeChange: (mode: 'economy' | 'standard' | 'ultra') => void;
  guidance: number;
  onGuidanceChange: (value: number) => void;
  steps: number;
  onStepsChange: (value: number) => void;
  autoOptimize: boolean;
  onAutoOptimizeChange: (value: boolean) => void;
  enhance: boolean;
  onEnhanceChange: (value: boolean) => void;
}

export default function AdvancedSettings({
  qualityMode,
  onQualityModeChange,
  guidance,
  onGuidanceChange,
  steps,
  onStepsChange,
  autoOptimize,
  onAutoOptimizeChange,
  enhance,
  onEnhanceChange
}: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">⚙️ 進階設定</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <Label>質量模式</Label>
            <Select value={qualityMode} onValueChange={(v) => onQualityModeChange(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">經濟模式 (快速)</SelectItem>
                <SelectItem value="standard">標準模式 (平衡)</SelectItem>
                <SelectItem value="ultra">超高清模式 (極致)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {qualityMode === 'economy' && '快速生成，適合測試'}
              {qualityMode === 'standard' && '平衡質量與速度'}
              {qualityMode === 'ultra' && '最高質量，較慢'}
            </p>
          </div>

          <div>
            <Label>Guidance Scale: {guidance}</Label>
            <Input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={guidance}
              onChange={(e) => onGuidanceChange(parseFloat(e.target.value))}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              控制圖像與提示詞的匹配度 (1-20)
            </p>
          </div>

          <div>
            <Label>Steps: {steps}</Label>
            <Input
              type="range"
              min="4"
              max="50"
              step="1"
              value={steps}
              onChange={(e) => onStepsChange(parseInt(e.target.value))}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              生成步驟數 (4-50)，更多步驟 = 更高質量
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoOptimize"
                checked={autoOptimize}
                onChange={(e) => onAutoOptimizeChange(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="autoOptimize" className="cursor-pointer">
                自動優化參數
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              根據模型和尺寸自動調整 steps 和 guidance
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enhance"
                checked={enhance}
                onChange={(e) => onEnhanceChange(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="enhance" className="cursor-pointer">
                HD 增強
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              自動添加高清優化提示詞
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
            <p className="text-xs">
              💡 <strong>建議</strong>：初次使用建議保持預設設定，然後根據需要調整。
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
