import React from "react"
import loadSettings from "@/mylib/loadsettings.ts"
import myuuid from "@/mylib/myuuid.ts"
import {toast} from "sonner"

// 服务端 SSE 消息
export interface Message {
  code: number
  title: string
  content: string
}

// 接收服务端的 SSE 消息
const MySSE = React.memo(() => {
  React.useEffect(() => {
    const settings = loadSettings()
    if (!settings.auth) {
      console.log("初始化 SSE 出错：请先进设置界限，设置授权码")
      toast.warning("初始化 SSE 出错", {description: "请先进设置界限，设置授权码"})
      return
    }

    // 初始化 SSE
    const eventSource = new EventSource(`/api/sse/events?auth=${settings.auth}&clientID=${myuuid}`)

    // 接收消息并显示
    eventSource.onmessage = (event) => {
      const message: Message = JSON.parse(event.data)
      console.log(message)

      if (message.code === 0) {
        toast.success(message.title, {description: message.content})
      } else {
        toast.error(message.title, {description: message.content})
      }
    }

    // 错误处理
    eventSource.onerror = (event) => {
      console.log("接收 SSE 消息出错", event)
      toast.error("接收 SSE 消息出错", {description: ""})
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // 不返回任何可渲染的内容
  return null
})

export default MySSE