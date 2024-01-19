import React, {FC} from "react"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"
import {useQuery} from "@tanstack/react-query"
import doAjax, {Result} from "@/mylib/doajax.ts"
import {RouterStatus} from "@/pages/RouterInfoType.ts"
import LoadingOrError from "@/mylib/dealLoad.tsx"

const QueryRouterStatus = "QueryRouterStatus"

// 状态值的属性
interface ValueProps {
  label: string
  value: string
}

// 某项信息组件
const Content: FC<ValueProps> = ({label, value}) => {
  return (
    <CardContent className={"pt-0 pb-0"}>
      <div className="flex gap-4 bg-white p-2">
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
      refetchInterval: 1000
    })

  const status = React.useMemo(() => {
    if (!data || !data.data) {
      return <div>出错</div>
    }

    return (
      <div className={"flex flex-col gap-4"}>
        <Card>
          <CardHeader className={"p-2"}>IP 地址</CardHeader>
          <Content label={"IPv4"} value={data.data.ipAddr.ipv4}/>
          <Content label={"IPv6"} value={data.data.ipAddr.ipv6}/>
        </Card>

        <Card>
          <CardHeader className={"p-2"}>内存使用</CardHeader>
          <Content label={"可用"} value={data.data.mem.available}/>
          <Content label={"已用"} value={data.data.mem.used}/>
          <Content label={"总共"} value={data.data.mem.total}/>
          <Content label={"占比"} value={`${data.data.mem.usedPercent}%`}/>
        </Card>

        <Card>
          <CardHeader className={"p-2"}>CPU 使用</CardHeader>
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