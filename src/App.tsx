import RuleManager from "./pages/RuleManager.tsx"
import RouterInfo from "./pages/RouterInfo.tsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Settings, {LS_SETTINGS} from "./pages/Settings.tsx"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./components/ui/tabs.tsx"
import './App.css'
import {Toaster} from "@/components/ui/toaster.tsx"

const queryClient = new QueryClient()

// 应用
const App = () => {
  let defaultTab = "rules"
  if (!localStorage.getItem(LS_SETTINGS)) {
    defaultTab = "settings"
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster/>

      <Tabs defaultValue={defaultTab} className="h-[100dvh] w-screen overflow-hidden 4k/2:w-3/5 mx-auto pl-2 pr-2">
        <TabsList>
          <TabsTrigger value="rules">Clash</TabsTrigger>
          <TabsTrigger value="router">路由器</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className={"h-full"}><RuleManager/></TabsContent>
        <TabsContent value="router" className={"h-full"}><RouterInfo/></TabsContent>
        <TabsContent value="settings" className={"h-full"}><Settings/></TabsContent>
      </Tabs>
    </QueryClientProvider>
  )
}

export default App