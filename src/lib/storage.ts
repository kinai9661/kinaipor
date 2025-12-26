// LocalStorage History Manager
import type { GenerationResult } from './flux-config';

export interface HistoryItem extends GenerationResult {
  id: string;
  prompt?: string;
  negativePrompt?: string;
  qualityMode?: 'economy' | 'standard' | 'ultra';
}

const STORAGE_KEY = 'flux-ai-history';
const MAX_HISTORY_ITEMS = 100;

export class HistoryManager {
  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  static addToHistory(item: Omit<HistoryItem, 'id'>): void {
    try {
      const history = this.getHistory();
      const newItem: HistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      history.unshift(newItem);
      
      // Keep only last MAX_HISTORY_ITEMS
      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  static deleteFromHistory(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete from history:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  static exportHistory(): void {
    try {
      const history = this.getHistory();
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flux-ai-history-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  }

  static getStats() {
    const history = this.getHistory();
    const total = history.length;
    const totalSize = new Blob([JSON.stringify(history)]).size;
    const sizeKB = (totalSize / 1024).toFixed(2);
    
    const recentStyle = history[0]?.style || '-';
    
    return {
      total,
      sizeKB,
      recentStyle
    };
  }
}
