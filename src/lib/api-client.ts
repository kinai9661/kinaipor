// Enhanced Pollinations API Client with HD Optimization and Reference Images
import { CONFIG, type GenerationOptions, type GenerationResult } from './flux-config';

interface EnhancedGenerationOptions extends GenerationOptions {
  guidance?: number;
  steps?: number;
  enhance?: boolean;
  autoOptimize?: boolean;
}

export class PollinationsClient {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
    this.endpoint = CONFIG.PROVIDERS.pollinations.endpoint;
  }

  private optimizeParameters(
    model: string,
    width: number,
    height: number,
    style: string,
    qualityMode: string = 'standard',
    userSteps?: number,
    userGuidance?: number
  ) {
    const totalPixels = width * height;
    const modelSteps: Record<string, { min: number; optimal: number; max: number }> = {
      zimage: { min: 8, optimal: 15, max: 25 },
      flux: { min: 15, optimal: 20, max: 30 },
      turbo: { min: 4, optimal: 8, max: 12 },
      kontext: { min: 18, optimal: 25, max: 35 }
    };

    const qualityMultipliers: Record<string, number> = {
      economy: 0.85,
      standard: 1.0,
      ultra: 1.35
    };

    const config = modelSteps[model] || modelSteps.flux;
    const multiplier = qualityMultipliers[qualityMode] || 1.0;
    
    // 根據尺寸調整
    let sizeMultiplier = 1.0;
    if (totalPixels >= 2048 * 2048) sizeMultiplier = 1.3;
    else if (totalPixels >= 1536 * 1536) sizeMultiplier = 1.15;
    else if (totalPixels >= 1024 * 1024) sizeMultiplier = 1.0;
    else sizeMultiplier = 0.8;

    const optimizedSteps = userSteps || Math.round(
      config.optimal * multiplier * sizeMultiplier
    );

    // Guidance Scale 優化
    let baseGuidance = 7.5;
    if (model === 'turbo') baseGuidance = 2.5;
    else if (style === 'photorealistic') baseGuidance = 8.5;
    else if (['oil-painting', 'watercolor'].includes(style)) baseGuidance = 6.5;

    const optimizedGuidance = userGuidance || baseGuidance;

    return {
      steps: Math.max(config.min, Math.min(optimizedSteps, config.max)),
      guidance: optimizedGuidance
    };
  }

  private enhancePromptWithHD(prompt: string, enhance: boolean, qualityMode: string) {
    if (!enhance) return prompt;

    const hdPrompts: Record<string, string> = {
      economy: 'high quality, detailed',
      standard: 'high quality, highly detailed, sharp focus, professional, 8k uhd',
      ultra: 'masterpiece, best quality, ultra detailed, 8k uhd, high resolution, professional photography, sharp focus, HDR'
    };

    const hdBoost = hdPrompts[qualityMode] || hdPrompts.standard;
    return `${prompt}, ${hdBoost}`;
  }

  /**
   * Upload reference image to a temporary host (if needed)
   * For Pollinations, we can use data URLs directly
   */
  private async uploadReferenceImage(dataUrl: string): Promise<string> {
    // Pollinations supports direct data URLs
    // For optimization, you could upload to a CDN here
    return dataUrl;
  }

  async generate(options: EnhancedGenerationOptions): Promise<GenerationResult[]> {
    const {
      prompt,
      model = 'zimage',
      width = 1024,
      height = 1024,
      style = 'none',
      seed = -1,
      negativePrompt = '',
      qualityMode = 'standard',
      numOutputs = 1,
      referenceImages = [],
      guidance,
      steps,
      enhance = false,
      autoOptimize = true
    } = options;

    // 應用風格
    const styleConfig = CONFIG.STYLE_PRESETS[style];
    let enhancedPrompt = prompt;
    let enhancedNegative = negativePrompt;

    if (styleConfig && styleConfig.prompt) {
      enhancedPrompt = `${prompt}, ${styleConfig.prompt}`;
    }
    if (styleConfig && styleConfig.negative) {
      enhancedNegative = enhancedNegative 
        ? `${enhancedNegative}, ${styleConfig.negative}` 
        : styleConfig.negative;
    }

    // HD 增強
    enhancedPrompt = this.enhancePromptWithHD(enhancedPrompt, enhance, qualityMode);

    // HD 負面提示詞
    if (enhance && qualityMode !== 'economy') {
      const hdNegative = 'blurry, low quality, distorted, ugly, bad anatomy, low resolution, pixelated, artifacts, noise';
      enhancedNegative = enhancedNegative
        ? `${enhancedNegative}, ${hdNegative}`
        : hdNegative;
    }

    // 參數優化
    let finalSteps = steps;
    let finalGuidance = guidance;

    if (autoOptimize) {
      const optimized = this.optimizeParameters(
        model,
        width,
        height,
        style,
        qualityMode,
        steps,
        guidance
      );
      finalSteps = optimized.steps;
      finalGuidance = optimized.guidance;
    } else {
      finalSteps = steps || 20;
      finalGuidance = guidance || 7.5;
    }

    // 構建完整提示詞
    let fullPrompt = enhancedPrompt;
    if (enhancedNegative) {
      fullPrompt = `${enhancedPrompt} [negative: ${enhancedNegative}]`;
    }

    const results: GenerationResult[] = [];

    // Process reference images if provided
    let processedReferenceImages: string[] = [];
    if (referenceImages && referenceImages.length > 0) {
      processedReferenceImages = await Promise.all(
        referenceImages.map(img => this.uploadReferenceImage(img))
      );
    }

    for (let i = 0; i < numOutputs; i++) {
      const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed + i;
      
      const params = new URLSearchParams({
        model,
        width: width.toString(),
        height: height.toString(),
        seed: currentSeed.toString(),
        nologo: 'true',
        enhance: enhance.toString(),
        private: 'true'
      });

      // 添加進階參數
      if (finalGuidance !== 7.5) {
        params.append('guidance', finalGuidance.toString());
      }
      if (finalSteps !== 20) {
        params.append('steps', finalSteps.toString());
      }

      // 圖生圖支持 - For Kontext model
      if (processedReferenceImages.length > 0 && model === 'kontext') {
        // Pollinations supports reference images via 'image' parameter
        // Format: comma-separated URLs or data URLs
        params.append('image', processedReferenceImages[0]); // Use first reference image
      }

      const url = `${this.endpoint}/image/${encodeURIComponent(fullPrompt)}?${params.toString()}`;

      const headers: HeadersInit = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
        'Referer': 'https://pollinations.ai/'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(CONFIG.FETCH_TIMEOUT)
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        results.push({
          url: imageUrl,
          model,
          seed: currentSeed,
          width,
          height,
          style,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Failed to generate image ${i + 1}:`, error);
        throw new Error(
          error instanceof Error 
            ? `生成失敗: ${error.message}` 
            : '圖像生成失敗，請稍後重試'
        );
      }
    }

    return results;
  }
}
