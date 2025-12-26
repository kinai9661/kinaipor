// Flux AI Pro Configuration
export const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "9.6.1-extended-styles",
  FETCH_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  
  POLLINATIONS_AUTH: {
    enabled: true,
    token: "",
    method: "header" as const
  },
  
  PRESET_SIZES: {
    "square-1k": { name: "方形 1024x1024", width: 1024, height: 1024 },
    "square-1.5k": { name: "方形 1536x1536", width: 1536, height: 1536 },
    "square-2k": { name: "方形 2048x2048", width: 2048, height: 2048 },
    "portrait-9-16-hd": { name: "豎屏 9:16 HD", width: 1080, height: 1920 },
    "landscape-16-9-hd": { name: "橫屏 16:9 HD", width: 1920, height: 1080 },
    "instagram-square": { name: "Instagram 方形", width: 1080, height: 1080 },
    "wallpaper-fhd": { name: "桌布 Full HD", width: 1920, height: 1080 }
  },
  
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://gen.pollinations.ai",
      pathPrefix: "/image",
      type: "direct" as const,
      enabled: true,
      default: true,
      models: [
        { 
          id: "zimage", 
          name: "Z-Image Turbo ⚡", 
          category: "zimage",
          description: "快速 6B 參數圖像生成",
          max_size: 2048
        },
        { 
          id: "flux", 
          name: "Flux 標準版", 
          category: "flux",
          description: "快速且高質量的圖像生成",
          max_size: 2048
        },
        { 
          id: "turbo", 
          name: "Flux Turbo ⚡", 
          category: "flux",
          description: "超快速圖像生成",
          max_size: 2048
        },
        { 
          id: "kontext", 
          name: "Kontext 🎨", 
          category: "kontext",
          description: "上下文感知圖像生成（支持圖生圖）",
          max_size: 2048,
          supports_reference_images: true,
          max_reference_images: 1
        }
      ]
    }
  },
  
  STYLE_PRESETS: {
    none: { 
      name: "無風格", 
      prompt: "", 
      negative: "",
      category: "basic",
      icon: "⚡"
    },
    anime: { 
      name: "動漫風格", 
      prompt: "anime style, anime art, vibrant colors, cel shading", 
      negative: "realistic, photograph, 3d",
      category: "illustration",
      icon: "🎭"
    },
    ghibli: { 
      name: "吉卜力", 
      prompt: "Studio Ghibli style, Hayao Miyazaki, anime, soft colors", 
      negative: "realistic, dark, 3D",
      category: "illustration",
      icon: "🍃"
    },
    manga: {
      name: "日本漫畫",
      prompt: "manga style, japanese comic art, black and white",
      negative: "color, realistic, photo",
      category: "manga",
      icon: "📖"
    },
    photorealistic: { 
      name: "寫實照片", 
      prompt: "photorealistic, 8k uhd, high quality, detailed", 
      negative: "anime, cartoon, illustration",
      category: "realistic",
      icon: "📷"
    },
    "oil-painting": { 
      name: "油畫", 
      prompt: "oil painting, canvas texture, visible brushstrokes", 
      negative: "photograph, digital art",
      category: "painting",
      icon: "🖼️"
    },
    watercolor: { 
      name: "水彩畫", 
      prompt: "watercolor painting, soft colors, paper texture", 
      negative: "photograph, digital",
      category: "painting",
      icon: "💧"
    },
    cyberpunk: { 
      name: "賽博朋克", 
      prompt: "cyberpunk style, neon lights, futuristic, sci-fi", 
      negative: "natural, rustic",
      category: "scifi",
      icon: "🌃"
    },
    "pixel-art": {
      name: "像素藝術",
      prompt: "pixel art, 8-bit, retro gaming style",
      negative: "high resolution, smooth",
      category: "digital",
      icon: "🎮"
    }
  },
  
  STYLE_CATEGORIES: {
    'basic': { name: '基礎', icon: '⚡', order: 1 },
    'illustration': { name: '插畫動畫', icon: '🎨', order: 2 },
    'manga': { name: '漫畫風格', icon: '📖', order: 3 },
    'realistic': { name: '寫實照片', icon: '📷', order: 4 },
    'painting': { name: '繪畫風格', icon: '🖼️', order: 5 },
    'scifi': { name: '科幻', icon: '🚀', order: 6 },
    'digital': { name: '數位風格', icon: '💻', order: 7 }
  }
};

export type Model = typeof CONFIG.PROVIDERS.pollinations.models[number]['id'];
export type Style = keyof typeof CONFIG.STYLE_PRESETS;
export type SizePreset = keyof typeof CONFIG.PRESET_SIZES;

export interface GenerationOptions {
  prompt: string;
  model?: Model;
  width?: number;
  height?: number;
  style?: Style;
  seed?: number;
  negativePrompt?: string;
  qualityMode?: 'economy' | 'standard' | 'ultra';
  numOutputs?: number;
  referenceImages?: string[];
}

export interface GenerationResult {
  url: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  style: string;
  timestamp: string;
}
