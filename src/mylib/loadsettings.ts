import {SettingsType} from "@/pages/SettingsType.ts"
import {LS_SETTINGS} from "@/pages/Settings.tsx"

// 导入存储在本地的设置
const loadSettings = (): SettingsType => {
  return JSON.parse(localStorage.getItem(LS_SETTINGS) || "{}")
}

export default loadSettings