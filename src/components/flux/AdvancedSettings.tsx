import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Zap } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          進階設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 質量模式 */}
        <div>
          <Label className="text-xs">質量模式</Label>
          <Select value={qualityMode} onValueChange={onQualityModeChange}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy (快速)</SelectItem>
              <SelectItem value="standard">Standard (標準)</SelectItem>
              <SelectItem value="ultra">Ultra (超高清)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 自動優化 */}
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            自動優化參數
          </Label>
          <input
            type="checkbox"
            checked={autoOptimize}
            onChange={(e) => onAutoOptimizeChange(e.target.checked)}
            className="rounded"
          />
        </div>

        {/* HD 增強 */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">✨ HD 增強</Label>
          <input
            type="checkbox"
            checked={enhance}
            onChange={(e) => onEnhanceChange(e.target.checked)}
            className="rounded"
          />
        </div>

        {/* Guidance Scale */}
        {!autoOptimize && (
          <div>
            <Label className="text-xs">Guidance Scale: {guidance}</Label>
            <Input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={guidance}
              onChange={(e) => onGuidanceChange(parseFloat(e.target.value))}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              較高值更符合提示詞
            </p>
          </div>
        )}

        {/* Steps */}
        {!autoOptimize && (
          <div>
            <Label className="text-xs">生成步數: {steps}</Label>
            <Input
              type="range"
              min="4"
              max="50"
              step="1"
              value={steps}
              onChange={(e) => onStepsChange(parseInt(e.target.value))}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              較高值質量更好但更慢
            </p>
          </div>
        )}

        {/* 提示信息 */}
        {autoOptimize && (
          <div className="bg-blue-500/10 border border-blue-500 rounded p-2">
            <p className="text-xs text-blue-500">
              ⚙️ 自動優化已啟用
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              參數將根據模型、尺寸和風格自動調整
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
