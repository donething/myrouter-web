// 路由器状态信息
export interface RouterStatus {
  ipAddr: IpAddr
  mem: Mem
  cpu: CPU
  logo: string  // 当前路由器的标识。如"RedmiAX6000"
}

export interface IpAddr {
  ipv4: string
  ipv6: string
}

export interface Mem {
  total: string
  available: string
  used: string
  usedPercent: number
}

export interface CPU {
  usedPercent: string
}