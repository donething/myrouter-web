import RuleManager from "./pages/RuleManager.tsx"
import RouterInfo from "./pages/RouterInfo.tsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Settings from "./pages/Settings.tsx"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./components/ui/tabs.tsx"
import './App.css'
import {Toaster} from "@/components/ui/toaster.tsx"

const queryClient = new QueryClient()

// 应用
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster/>

      <Tabs defaultValue="rules" className="flex flex-col h-screen pl-2 pr-2 overflow-hidden">
        <TabsList>
          <TabsTrigger value="rules">Clash</TabsTrigger>
          <TabsTrigger value="router">路由器</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>
        <TabsContent value="rules"><RuleManager/></TabsContent>
        <TabsContent value="router"><RouterInfo/></TabsContent>
        <TabsContent value="settings"><Settings/></TabsContent>
      </Tabs>
    </QueryClientProvider>
  )
}

export default App