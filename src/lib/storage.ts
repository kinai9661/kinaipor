// LocalStorage History Manager
import { type GenerationResult } from './flux-config';

const STORAGE_KEY = 'flux_ai_history';
const MAX_HISTORY = 100;

export interface HistoryItem extends GenerationResult {
  id: string;
  prompt: string;
  negativePrompt?: string;
  qualityMode?: string;
  referenceImages?: string[];
}

export class HistoryManager {
  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  }

  static saveHistory(history: HistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }

  static addToHistory(item: Omit<HistoryItem, 'id'>): void {
    let history = this.getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    history.unshift(newItem);
    
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    
    this.saveHistory(history);
  }

  static deleteFromHistory(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    this.saveHistory(filtered);
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static exportHistory(): void {
    const history = this.getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flux-ai-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  static getStats() {
    const history = this.getHistory();
    const sizeKB = new Blob([JSON.stringify(history)]).size / 1024;
    const recentStyle = history.length > 0 ? history[0].style : '-';
    
    return {
      total: history.length,
      sizeKB: sizeKB.toFixed(1),
      recentStyle
    };
  }
}
