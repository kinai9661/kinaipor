// Chinese to English Translation using Cloudflare Workers AI
// You can deploy this as a Cloudflare Worker for translation

export interface TranslationOptions {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

export interface TranslationResult {
  translatedText: string;
  originalText: string;
  detected?: string;
}

export class Translator {
  private workerEndpoint: string;
  private enabled: boolean;

  constructor(workerEndpoint: string = '', enabled: boolean = false) {
    this.workerEndpoint = workerEndpoint;
    this.enabled = enabled && !!workerEndpoint;
  }

  // 判斷是否为中文
  private isChinese(text: string): boolean {
    // 中文字符范围：\u4e00-\u9fff
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(text);
  }

  // 简单的本地翻译（后备）
  private simpleTranslate(text: string): string {
    // 常见艺术词汇对照表
    const commonPhrases: Record<string, string> = {
      '一个': 'a',
      '一位': 'a',
      '美丽的': 'beautiful',
      '漂亮的': 'beautiful',
      '可爱的': 'cute',
      '超现实': 'surreal',
      '幻想': 'fantasy',
      '科幻': 'sci-fi',
      '动漫': 'anime',
      '漫画': 'manga',
      '油画': 'oil painting',
      '水彩': 'watercolor',
      '素描': 'sketch',
      '风景': 'landscape',
      '人物': 'character portrait',
      '猫咖': 'cat',
      '狗': 'dog',
      '花': 'flower',
      '山': 'mountain',
      '海': 'ocean',
      '森林': 'forest',
      '城市': 'city',
      '晚隈': 'sunset',
      '星空': 'starry sky',
      '夜景': 'night scene',
      '白天': 'daytime',
      '高清': 'high quality, detailed',
      '细节': 'detailed',
      '真实': 'realistic',
      '写实': 'photorealistic',
      '艺术': 'artistic'
    };

    let translated = text;
    for (const [cn, en] of Object.entries(commonPhrases)) {
      translated = translated.replace(new RegExp(cn, 'g'), en);
    }

    return translated;
  }

  // 使用 Workers AI 翻译
  async translateWithWorkers(text: string): Promise<string> {
    if (!this.enabled || !this.workerEndpoint) {
      return this.simpleTranslate(text);
    }

    try {
      const response = await fetch(`${this.workerEndpoint}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          source_lang: 'zh',
          target_lang: 'en'
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const result = await response.json();
      return result.translated_text || text;
    } catch (error) {
      console.warn('Workers AI translation failed, using simple translation:', error);
      return this.simpleTranslate(text);
    }
  }

  // 主翻译方法
  async translate(options: TranslationOptions): Promise<TranslationResult> {
    const { text, sourceLang = 'auto', targetLang = 'en' } = options;

    // 如果不是中文，直接返回
    if (!this.isChinese(text)) {
      return {
        translatedText: text,
        originalText: text,
        detected: 'en'
      };
    }

    // 尝试使用 Workers AI
    const translatedText = await this.translateWithWorkers(text);

    return {
      translatedText,
      originalText: text,
      detected: 'zh'
    };
  }

  // 检查是否需要翻译
  needsTranslation(text: string): boolean {
    return this.isChinese(text);
  }
}

// 默认实例（未启用）
export const defaultTranslator = new Translator('', false);

// Cloudflare Workers 翻译 Worker 代码示例
// 你可以将此代码部署为 Cloudflare Worker
/*
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { text, source_lang, target_lang } = await request.json();

    try {
      const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
        text,
        source_lang: source_lang || 'zh',
        target_lang: target_lang || 'en'
      });

      return Response.json(
        { translated_text: response.translated_text },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      return Response.json(
        { error: 'Translation failed', message: error.message },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
  }
};
*/
