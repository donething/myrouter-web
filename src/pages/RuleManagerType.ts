// 添加的规则的类型
export const RuleTypes = ["DOMAIN-SUFFIX", "DOMAIN-KEYWORD", "DOMAIN", "GEOIP", "GEOSITE",
  "IP-CIDR", "SRC-IP-CIDR", "DST-PORT", "SRC-PORT", "IP-CIDR6"]

// RuleType 类型，可以是 RuleTypes 数组中的任一值
type RuleType = typeof RuleTypes[number]

// 客户端渲染Clash部分网页所需的数据
export interface RenderData {
  rules: string[]        // 自定义的规则
  proxyGroups: string[]  // 所有代理组
}

// 一条规则需要的元素
export interface ClashRule {
  type: RuleType
  domain: string
  proxyGroup: string
}