// Chinese to English Translation Service
// Supports Workers AI and fallback translation methods

export interface TranslationResult {
  original: string;
  translated: string;
  detected_language: string;
  confidence: number;
  provider: string;
}

interface WorkersAIConfig {
  enabled: boolean;
  accountId?: string;
  apiToken?: string;
  model: string;
}

const WORKERS_AI_CONFIG: WorkersAIConfig = {
  enabled: false, // 需要用戶配置
  model: '@cf/meta/m2m100-1.2b'
};

export class TranslationService {
  private workersAIEndpoint?: string;

  constructor(
    accountId?: string,
    apiToken?: string
  ) {
    if (accountId && apiToken) {
      this.workersAIEndpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${WORKERS_AI_CONFIG.model}`;
      WORKERS_AI_CONFIG.enabled = true;
      WORKERS_AI_CONFIG.accountId = accountId;
      WORKERS_AI_CONFIG.apiToken = apiToken;
    }
  }

  /**
   * 檢測是否需要翻譯（含有中文字符）
   */
  static needsTranslation(text: string): boolean {
    // 檢測 CJK (Chinese, Japanese, Korean) 字符
    const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff]/u;
    return cjkRegex.test(text);
  }

  /**
   * 使用 Workers AI 翻譯
   */
  async translateWithWorkersAI(text: string): Promise<TranslationResult> {
    if (!WORKERS_AI_CONFIG.enabled || !this.workersAIEndpoint || !WORKERS_AI_CONFIG.apiToken) {
      throw new Error('Workers AI 未配置');
    }

    try {
      const response = await fetch(this.workersAIEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WORKERS_AI_CONFIG.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          source_lang: 'zh',
          target_lang: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Workers AI 錯誤: ${response.status}`);
      }

      const data = await response.json();

      return {
        original: text,
        translated: data.result.translated_text || text,
        detected_language: 'zh',
        confidence: 0.95,
        provider: 'workers-ai'
      };
    } catch (error) {
      console.error('Workers AI 翻譯失敗:', error);
      throw error;
    }
  }

  /**
   * 本地簡單翻譯（Fallback）
   */
  static translateLocally(text: string): TranslationResult {
    // 簡單的預設翻譯映射
    const commonPhrases: Record<string, string> = {
      '一個': 'a',
      '可愛的': 'cute',
      '美麗的': 'beautiful',
      '漂亮的': 'pretty',
      '帥氣的': 'handsome',
      '女孩': 'girl',
      '男孩': 'boy',
      '貓咄': 'cat',
      '狗': 'dog',
      '花': 'flower',
      '樹': 'tree',
      '山': 'mountain',
      '海': 'ocean',
      '天空': 'sky',
      '雲': 'cloud',
      '太陽': 'sun',
      '月亮': 'moon',
      '星星': 'star',
      '風景': 'scenery',
      '城市': 'city',
      '房子': 'house',
      '車': 'car',
      '飛機': 'airplane',
      '船': 'ship',
      '日落': 'sunset',
      '日出': 'sunrise',
      '夏天': 'summer',
      '冬天': 'winter',
      '春天': 'spring',
      '秋天': 'autumn',
      '晚上': 'night',
      '白天': 'day',
      '紅色': 'red',
      '藍色': 'blue',
      '綠色': 'green',
      '黃色': 'yellow',
      '紫色': 'purple',
      '粉紅色': 'pink',
      '黑色': 'black',
      '白色': 'white'
    };

    let translated = text;

    // 替換常用詞彙
    for (const [zh, en] of Object.entries(commonPhrases)) {
      translated = translated.replace(new RegExp(zh, 'g'), en);
    }

    // 如果沒有變化，直接返回原文 (讓 AI 自己處理)
    if (translated === text) {
      console.warn('本地翻譯無法處理，保持原文');
    }

    return {
      original: text,
      translated: translated === text ? text : translated,
      detected_language: 'zh',
      confidence: 0.5,
      provider: 'local-fallback'
    };
  }

  /**
   * 自動翻譯 (嘗試 Workers AI，失敗則使用本地)
   */
  async translate(text: string): Promise<TranslationResult> {
    if (!TranslationService.needsTranslation(text)) {
      return {
        original: text,
        translated: text,
        detected_language: 'en',
        confidence: 1.0,
        provider: 'none'
      };
    }

    // 嘗試 Workers AI
    if (WORKERS_AI_CONFIG.enabled) {
      try {
        return await this.translateWithWorkersAI(text);
      } catch (error) {
        console.warn('Workers AI 翻譯失敗，使用本地翻譯:', error);
      }
    }

    // Fallback 到本地翻譯
    return TranslationService.translateLocally(text);
  }

  /**
   * 批量翻譯
   */
  async batchTranslate(texts: string[]): Promise<TranslationResult[]> {
    const results: TranslationResult[] = [];

    for (const text of texts) {
      try {
        const result = await this.translate(text);
        results.push(result);
        
        // 防止 API 速率限制
        if (WORKERS_AI_CONFIG.enabled) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`翻譯失敗: ${text}`, error);
        results.push({
          original: text,
          translated: text,
          detected_language: 'unknown',
          confidence: 0,
          provider: 'error'
        });
      }
    }

    return results;
  }
}

// 全局翻譯實例
export const translator = new TranslationService();

// 配置函數
export function configureTranslator(accountId: string, apiToken: string): TranslationService {
  return new TranslationService(accountId, apiToken);
}
