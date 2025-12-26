// HD Optimization and Quality Modes
import { CONFIG, type Model, type Style } from './flux-config';

export type QualityMode = 'economy' | 'standard' | 'ultra';

interface HDOptimizationResult {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  optimized: boolean;
  optimizations: string[];
}

export const QUALITY_MODES = {
  economy: {
    name: '經濟模式',
    description: '快速出圖，節省資源',
    stepsMultiplier: 0.85,
    guidanceMultiplier: 0.9,
    hdBoost: 'high quality, detailed',
    icon: '⚡'
  },
  standard: {
    name: '標準模式',
    description: '平衡質量與速度',
    stepsMultiplier: 1.0,
    guidanceMultiplier: 1.0,
    hdBoost: 'high quality, highly detailed, sharp focus, professional',
    icon: '⭐'
  },
  ultra: {
    name: '超高清模式',
    description: '極致質量，較慢速度',
    stepsMultiplier: 1.35,
    guidanceMultiplier: 1.15,
    hdBoost: 'masterpiece, best quality, ultra detailed, 8k uhd, high resolution, professional photography, sharp focus, HDR',
    icon: '💎'
  }
};

const HD_NEGATIVE = 'blurry, low quality, distorted, ugly, bad anatomy, low resolution, pixelated, artifacts, noise';

const MODEL_OPTIMAL_STEPS: Record<Model, number> = {
  zimage: 15,
  flux: 20,
  turbo: 8,
  kontext: 25
};

const MODEL_BASE_GUIDANCE: Record<Model, number> = {
  zimage: 7.0,
  flux: 7.5,
  turbo: 3.0,
  kontext: 8.0
};

export class HDOptimizer {
  static optimize(
    prompt: string,
    negativePrompt: string,
    model: Model,
    width: number,
    height: number,
    style: Style,
    qualityMode: QualityMode = 'standard',
    autoHD: boolean = true
  ): HDOptimizationResult {
    const optimizations: string[] = [];
    let finalPrompt = prompt;
    let finalNegativePrompt = negativePrompt;
    let finalWidth = width;
    let finalHeight = height;

    if (!autoHD) {
      return {
        prompt: finalPrompt,
        negativePrompt: finalNegativePrompt,
        width: finalWidth,
        height: finalHeight,
        steps: MODEL_OPTIMAL_STEPS[model] || 20,
        guidance: MODEL_BASE_GUIDANCE[model] || 7.5,
        optimized: false,
        optimizations: ['未啟用自動優化']
      };
    }

    const modeConfig = QUALITY_MODES[qualityMode];

    // 1. HD 提示詞增強
    if (modeConfig.hdBoost && !prompt.toLowerCase().includes('high quality')) {
      finalPrompt = `${prompt}, ${modeConfig.hdBoost}`;
      optimizations.push(`HD增強: ${modeConfig.name}`);
    }

    // 2. 負面提示詞增強
    if (qualityMode !== 'economy') {
      finalNegativePrompt = negativePrompt
        ? `${negativePrompt}, ${HD_NEGATIVE}`
        : HD_NEGATIVE;
      optimizations.push('負面提示詞: HD過濾');
    }

    // 3. 尺寸優化 - 確保最小解析度
    const minResolution = qualityMode === 'ultra' ? 1536 : qualityMode === 'standard' ? 1280 : 1024;
    const currentRes = Math.min(width, height);

    if (currentRes < minResolution) {
      const scale = minResolution / currentRes;
      finalWidth = Math.min(Math.round(width * scale / 64) * 64, 2048);
      finalHeight = Math.min(Math.round(height * scale / 64) * 64, 2048);
      optimizations.push(`尺寸提升: ${width}x${height} → ${finalWidth}x${finalHeight}`);
    }

    // 4. Steps 優化
    const baseSteps = MODEL_OPTIMAL_STEPS[model] || 20;
    const optimizedSteps = Math.round(baseSteps * modeConfig.stepsMultiplier);
    optimizations.push(`Steps: ${baseSteps} → ${optimizedSteps}`);

    // 5. Guidance 優化
    const baseGuidance = this.calculateGuidance(model, style);
    const optimizedGuidance = Math.round(baseGuidance * modeConfig.guidanceMultiplier * 10) / 10;
    if (optimizedGuidance !== baseGuidance) {
      optimizations.push(`Guidance: ${baseGuidance} → ${optimizedGuidance}`);
    }

    return {
      prompt: finalPrompt,
      negativePrompt: finalNegativePrompt,
      width: finalWidth,
      height: finalHeight,
      steps: optimizedSteps,
      guidance: optimizedGuidance,
      optimized: true,
      optimizations
    };
  }

  static calculateGuidance(model: Model, style: Style): number {
    const baseGuidance = MODEL_BASE_GUIDANCE[model] || 7.5;

    // 根據風格調整
    const styleConfig = CONFIG.STYLE_PRESETS[style];
    if (!styleConfig) return baseGuidance;

    // 寫實風格需要更高的 guidance
    if (style === 'photorealistic' || style === '3d-render') {
      return baseGuidance + 1.0;
    }

    // 藝術風格可以降低 guidance
    if (['watercolor', 'sketch', 'abstract'].includes(style)) {
      return baseGuidance - 0.5;
    }

    return baseGuidance;
  }

  static analyzePromptComplexity(prompt: string): number {
    const complexKeywords = [
      'detailed', 'intricate', 'complex', 'elaborate',
      'realistic', 'photorealistic', 'hyperrealistic',
      'architecture', 'cityscape', 'landscape', 'portrait',
      'texture', 'material', 'lighting', 'shadows',
      'fine details', 'high detail', 'ultra detailed',
      '4k', '8k', 'uhd', 'hdr'
    ];

    let score = 0;
    const lowerPrompt = prompt.toLowerCase();

    complexKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) score += 0.1;
    });

    if (prompt.length > 100) score += 0.2;
    if (prompt.length > 200) score += 0.3;
    if (prompt.split(',').length > 5) score += 0.15;

    return Math.min(score, 1.0);
  }

  static recommendQualityMode(prompt: string, model: Model): QualityMode {
    const complexity = this.analyzePromptComplexity(prompt);

    // Turbo 模型適合 economy
    if (model === 'turbo') return 'economy';

    // Kontext 適合 ultra
    if (model === 'kontext') return 'ultra';

    // 根據複雜度推薦
    if (complexity > 0.7) return 'ultra';
    if (complexity > 0.4) return 'standard';
    return 'economy';
  }
}
