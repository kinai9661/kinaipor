import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Kinaipor</h1>
            <p className="text-muted-foreground">
              shadcn/ui + Cloudflare Workers 專案模板
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8 space-y-4">
            <h2 className="text-2xl font-semibold">技術棧</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>React 18 + TypeScript</li>
              <li>Vite - 快速開發構建工具</li>
              <li>shadcn/ui - 高質量 UI 組件庫</li>
              <li>Tailwind CSS - 實用優先的 CSS 框架</li>
              <li>Cloudflare Workers - Edge 運行環境</li>
              <li>Hono - 輕量級 Web 框架</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button>主要按鈕</Button>
            <Button variant="secondary">次要按鈕</Button>
            <Button variant="outline">輪廓按鈕</Button>
            <Button variant="ghost">幽靈按鈕</Button>
          </div>

          <div className="rounded-lg bg-muted p-6">
            <p className="text-sm text-muted-foreground">
              💡 提示：運行 <code className="bg-background px-2 py-1 rounded">npx shadcn@latest add [component]</code> 來添加更多組件
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
