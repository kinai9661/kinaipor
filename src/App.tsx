import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Sparkles, Code2, Zap, Globe, Moon, Sun } from "lucide-react"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Kinaipor</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <a
                href="https://github.com/kinai9661/kinaipor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            shadcn/ui + Cloudflare Workers
          </div>
          <h2 className="text-5xl font-bold tracking-tight">
            現代化的全端開發框架
          </h2>
          <p className="text-xl text-muted-foreground">
            基於 React、TypeScript、Tailwind CSS 和 Cloudflare Workers 構建的高性能 Web 應用模板
          </p>
          <div className="flex gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  開始使用
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>歡迎使用 Kinaipor</DialogTitle>
                  <DialogDescription>
                    填寫您的信息開始體驗我們的服務
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      placeholder="請輸入您的姓名"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">電子郵件</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">確認提交</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="lg">
              <Code2 className="mr-2 h-5 w-5" />
              查看文檔
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">核心特性</h3>
            <p className="text-muted-foreground">
              集成現代化開發工具，提供極致的開發體驗
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Code2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>React 18 + TypeScript</CardTitle>
                <CardDescription>
                  使用最新的 React 18 和 TypeScript 開發，享受完整的類型安全
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>shadcn/ui 組件</CardTitle>
                <CardDescription>
                  精美的 UI 組件庫，完全可定制，無需額外安裝包
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Vite 構建</CardTitle>
                <CardDescription>
                  閃電般的熱更新速度，極速的開發體驗
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Cloudflare Workers</CardTitle>
                <CardDescription>
                  全球 Edge 網絡部署，超低延遲，無服務器架構
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Moon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>深色模式</CardTitle>
                <CardDescription>
                  內建深色模式支持，使用 CSS 變量輕鬆切換主題
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Github className="h-8 w-8 text-primary mb-2" />
                <CardTitle>開源免費</CardTitle>
                <CardDescription>
                  完全開源，MIT 許可證，可自由使用和修改
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>技術棧</CardTitle>
              <CardDescription>
                本項目使用的核心技術和工具
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">前端框架</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• React 18 - UI 框架</li>
                    <li>• TypeScript - 類型安全</li>
                    <li>• Vite - 構建工具</li>
                    <li>• shadcn/ui - UI 組件庫</li>
                    <li>• Tailwind CSS - 樣式框架</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">部署與工具</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Cloudflare Workers - 無服務器運行時</li>
                    <li>• Hono - Web 框架</li>
                    <li>• Wrangler - 部署工具</li>
                    <li>• Radix UI - 無障礙組件</li>
                    <li>• Lucide Icons - 圖標庫</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Code2 className="mr-2 h-4 w-4" />
                查看完整文檔
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">準備開始了嗎？</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                克隆倉庫並開始構建您的下一個項目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <code>git clone https://github.com/kinai9661/kinaipor.git</code>
                <br />
                <code>cd kinaipor</code>
                <br />
                <code>npm install</code>
                <br />
                <code>npm run dev</code>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="secondary" className="flex-1">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
              <Button variant="secondary" className="flex-1">
                <Globe className="mr-2 h-4 w-4" />
                查看演示
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2025 Kinaipor. Built with ❤️ using shadcn/ui
              </span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                文檔
              </Button>
              <Button variant="ghost" size="sm">
                示例
              </Button>
              <Button variant="ghost" size="sm">
                關於
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
