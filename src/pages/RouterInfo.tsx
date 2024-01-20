import React, {FC} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"
import {useQuery} from "@tanstack/react-query"
import doAjax, {Result} from "@/mylib/doajax.ts"
import {RouterStatus} from "@/pages/RouterInfoType.ts"
import LoadingOrError from "@/mylib/dealLoad.tsx"
import {retryTimeout} from "@/mylib/query.ts"

const QueryRouterStatus = "QueryRouterStatus"

// 状态值的属性
interface ValueProps {
  label: string
  value: string
}

// 某项信息组件
const Content: FC<ValueProps> = ({label, value}) => {
  return (
    <CardContent>
      <div className="flex flex-row gap-4 bg-white">
        <p className="text-gray-600 font-medium">{label}</p>
        <p className="text-indigo-600 font-semibold">{value}</p>
      </div>
    </CardContent>
  )
}

// 路由器信息组件
const RouterInfo = React.memo(() => {
  const {data, isLoading, error} =
    useQuery<Result<RouterStatus>>({
      queryKey: [QueryRouterStatus],
      queryFn: () => doAjax("/api/router/status"),
      refetchInterval: 1000,
      retry: retryTimeout
    })

  const status = React.useMemo(() => {
    if (!data || !data.data) {
      return <div>出错</div>
    }

    return (
      <div className={"flex flex-col gap-2"}>
        <Card>
          <CardHeader>IP 地址</CardHeader>
          <Content label={"IPv4"} value={data.data.ipAddr.ipv4 || "为空或不是公网地址"}/>
          <Content label={"IPv6"} value={data.data.ipAddr.ipv6}/>
        </Card>

        <Card>
          <CardHeader>内存使用</CardHeader>
          <Content label={"可用"} value={data.data.mem.available}/>
          <Content label={"已用"} value={data.data.mem.used}/>
          <Content label={"总共"} value={data.data.mem.total}/>
          <Content label={"占比"} value={`${data.data.mem.usedPercent}%`}/>
        </Card>

        <Card>
          <CardHeader>CPU 使用</CardHeader>
          <Content label={"占比"} value={`${data.data.cpu.usedPercent}%`}/>
        </Card>
      </div>
    )
  }, [data])

  // 处理请求数据
  if (isLoading || error) {
    return <LoadingOrError isLoading={isLoading} error={error}/>
  }

  return (status)
})

export default RouterInfo