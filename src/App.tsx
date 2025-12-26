import { useState } from 'react';
import FluxGenerator from './components/flux/FluxGenerator';
import HistoryGallery from './components/flux/HistoryGallery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { type HistoryItem } from './lib/storage';
import { CONFIG } from './lib/flux-config';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [generatorKey, setGeneratorKey] = useState(0);
  const [reuseData, setReuseData] = useState<HistoryItem | null>(null);

  const handleReusePrompt = (item: HistoryItem) => {
    setReuseData(item);
    setGeneratorKey(prev => prev + 1);
    setActiveTab('generate');
  };

  const stylesCount = Object.keys(CONFIG.STYLE_PRESETS).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">🎨 Flux AI Pro</h1>
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
              v{CONFIG.PROJECT_VERSION}
            </span>
          </div>
          <p className="text-muted-foreground">
            {stylesCount} 種風格 | 4 個 AI 模型 | 基於 shadcn/ui
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="text-base">
              <span className="mr-2">🎨</span>
              生成圖像
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base">
              <span className="mr-2">📋</span>
              歷史記錄
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <FluxGenerator key={generatorKey} reuseData={reuseData} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryGallery onReusePrompt={handleReusePrompt} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a 
              href="https://pollinations.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pollinations.ai
            </a>
            {' '}| Built with{' '}
            <a 
              href="https://ui.shadcn.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              shadcn/ui
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
