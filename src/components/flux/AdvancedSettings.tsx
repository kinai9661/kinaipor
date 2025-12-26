import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

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
    <div className="border-t pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-3"
      >
        <Settings className="h-4 w-4 mr-2" />
        進階設定
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 ml-auto" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-auto" />
        )}
      </Button>

      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⚙️ 高級參數</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 質量模式 */}
            <div>
              <Label>質量模式</Label>
              <Select value={qualityMode} onValueChange={onQualityModeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">
                    <span className="flex items-center">
                      💰 經濟模式
                    </span>
                  </SelectItem>
                  <SelectItem value="standard">
                    <span className="flex items-center">
                      ⭐ 標準模式 (推薦)
                    </span>
                  </SelectItem>
                  <SelectItem value="ultra">
                    <span className="flex items-center">
                      💎 超高清模式
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {qualityMode === 'economy' && '快速生成，較低質量'}
                {qualityMode === 'standard' && '平衡速度與質量'}
                {qualityMode === 'ultra' && '最高質量，需要較長時間'}
              </p>
            </div>

            {/* 自動優化 */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoOptimize"
                  checked={autoOptimize}
                  onChange={(e) => onAutoOptimizeChange(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="autoOptimize" className="cursor-pointer">
                  ⚙️ 自動優化參數
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                根據模型和尺寸自動調整 Steps 和 Guidance Scale
              </p>
            </div>

            {/* HD 增強 */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enhance"
                  checked={enhance}
                  onChange={(e) => onEnhanceChange(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="enhance" className="cursor-pointer">
                  ✨ HD 增強
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                自動添加高清質量提示詞，提升圖像細節
              </p>
            </div>

            {/* 手動參數調整 */}
            {!autoOptimize && (
              <>
                <div className="border-t pt-3">
                  <Label className="text-sm font-semibold">手動參數調整</Label>
                </div>

                {/* Guidance Scale */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs">Guidance Scale</Label>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {guidance.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={guidance}
                    onChange={(e) => onGuidanceChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1.0 (較自由)</span>
                    <span>15.0 (較精確)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    控制模型對提示詞的遵循程度
                  </p>
                </div>

                {/* Steps */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs">生成步驟 (Steps)</Label>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {steps}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="50"
                    step="1"
                    value={steps}
                    onChange={(e) => onStepsChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>4 (快)</span>
                    <span>50 (慢但細篇)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    生成迭代次數，更多步驟通常產生更好的結果
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500 rounded p-2">
                  <p className="text-xs text-yellow-600 dark:text-yellow-500">
                    ⚠️ 手動調整可能影響生成質量，建議使用自動優化
                  </p>
                </div>
              </>
            )}

            {/* 說明卡片 */}
            <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
              <p className="text-xs font-semibold mb-1">💡 提示</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 質量模式影響生成速度和細節</li>
                <li>• HD 增強適用於寫實風格</li>
                <li>• 自動優化推薦給新手使用</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
