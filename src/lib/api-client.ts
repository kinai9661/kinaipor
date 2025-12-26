// Pollinations API Client
import { CONFIG, type GenerationOptions, type GenerationResult } from './flux-config';

export class PollinationsClient {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
    this.endpoint = CONFIG.PROVIDERS.pollinations.endpoint;
  }

  async generate(options: GenerationOptions): Promise<GenerationResult[]> {
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
      referenceImages = []
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

    // 構建完整提示詞
    let fullPrompt = enhancedPrompt;
    if (enhancedNegative) {
      fullPrompt = `${enhancedPrompt} [negative: ${enhancedNegative}]`;
    }

    const results: GenerationResult[] = [];

    for (let i = 0; i < numOutputs; i++) {
      const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed + i;
      
      const params = new URLSearchParams({
        model,
        width: width.toString(),
        height: height.toString(),
        seed: currentSeed.toString(),
        nologo: 'true',
        enhance: 'false',
        private: 'true'
      });

      if (referenceImages.length > 0) {
        params.append('image', referenceImages.join(','));
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

      const response = await fetch(url, {
        method: 'GET',
        headers
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
    }

    return results;
  }
}
