import {LS_SETTINGS} from "@/pages/Settings.tsx"
import {SettingsType} from "@/pages/SettingsType.ts"

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
  const settings: SettingsType = JSON.parse(localStorage.getItem(LS_SETTINGS) || "{}")
  if (!settings.auth) {
    throw Error("请先进设置界限，设置操作授权码")
  }

  const method = data ? "POST" : "GET"
  const body = data ? JSON.stringify(data) : undefined
  const headers = {
    "Authorization": "Bearer " + settings.auth,
    "Content-Type": body ? "application/json" : ""
  }

  const resp = await fetch(path, {headers, method, body})
  return resp.json()
}

export default doAjax