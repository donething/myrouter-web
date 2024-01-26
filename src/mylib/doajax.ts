import loadSettings from "@/mylib/loadsettings.ts"
import myuuid from "@/mylib/myuuid.ts"

// 服务端的响应值
export interface Result<T> {
  code: number
  msg: string
  data?: T
}

// POST 到服务端的 JSON 数据
export interface Data {
  data: unknown
}

/**
 * 执行 fetch 网络请求
 */
const doAjax = async (path: string, data?: Data) => {
  const settings = loadSettings()
  if (!settings.auth) {
    throw Error("请先进设置界限，设置授权码")
  }

  const method = data ? "POST" : "GET"
  const body = data ? JSON.stringify(data) : undefined
  const headers = {
    "Authorization": "Bearer " + settings.auth,
    "Content-Type": body ? "application/json" : "",
    "clientID": myuuid
  }

  const resp = await fetch(path, {headers, method, body})
  // 获取出错
  if (resp.status < 200 || resp.status >= 400) {
    throw Error(resp.statusText)
  }

  return await resp.json()
}

export default doAjax