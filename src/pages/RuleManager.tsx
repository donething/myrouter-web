import React from "react"
import {QueryObserverResult, RefetchOptions, useQuery} from "@tanstack/react-query"
import {Result} from "@/mylib/doajax.ts"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {ClashRule, RenderData, RuleTypes} from "@/pages/RuleManagerType.ts"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx"
import LoadingOrError from "@/mylib/dealLoad.tsx"
import {Button} from "@/components/ui/button.tsx"
import doAjax from "@/mylib/doajax.ts"
import {retryTimeout} from "@/mylib/query.ts"
import {toast} from "sonner"

const QueryRenderData = ["QueryRenderData"]

// 执行 Clash 命令。值需要和后端的`clash.go`中的`Cmd`值一致，才能正确发起请求
type Cmd = "start" | "stop"
const cmdStart: Cmd = "start"
const cmdStop: Cmd = "stop"

// 新规则的默认值
const defaultValue: ClashRule = {
  type: "",
  domain: "",
  proxyGroup: ""
}

// 规则项组件的属性
interface RuleItemProps {
  rule: string
  data: Result<RenderData>
  refetch: (options?: (RefetchOptions | undefined)) => Promise<QueryObserverResult<unknown, Error>>
}

// POST 添加规则
const addRule = async (ruleStr: string) => {
  const obj: Result<string> = await doAjax("/api/clash/rule/add", {data: ruleStr})
  if (obj.code !== 0) {
    console.log(`规则添加失败'${ruleStr}'：`, obj.msg)
    toast.error("规则添加失败", {description: obj.msg})
    return false
  }

  toast.success("已添加/恢复规则", {description: ruleStr})
  return true
}

// 规则项的组件
const RuleItem = React.memo((props: RuleItemProps) => {
  const onDel = React.useCallback(async () => {
    if (!props.data.data) {
      return
    }

    const data = {data: props.rule}
    const obj: Result<string> = await doAjax("/api/clash/rule/del", data)
    if (obj.code !== 0) {
      console.log(`规则删除失败'${props.rule}'：`, obj.msg)
      toast.error("规则删除失败", {description: obj.msg + "：\n" + props.rule})
      return
    }

    await props.refetch()
    console.log(`已删除规则'${props.rule}'`)
    toast.success("已删除规则", {
      description: props.rule,
      action: {label: "恢复", onClick: () => addRule(props.rule)}
    })
  }, [props])

  return (
    <div className={"flex flex-row items-center justify-between"}>
      <span>{props.rule}</span>
      <Button size={"sm"} variant={"destructive"} onClick={onDel}>删除</Button>
    </div>
  )
})

// 规则管理组件
const RuleManager = React.memo(() => {
  const [newRule, setNewRule] = React.useState<ClashRule>(defaultValue)

  const {data, isLoading, error, refetch} =
    useQuery<Result<RenderData>>({
      queryKey: QueryRenderData,
      queryFn: () => doAjax("/api/clash/data/render"),
      retry: retryTimeout
    })

  // 输入新规则
  const onDomainChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRule(prev => ({...prev, domain: event.target.value}))
  }, [])
  const onTypeChange = React.useCallback((value: string) => {
    setNewRule(prev => ({...prev, type: value}))
  }, [])
  const onProxyGroupChange = React.useCallback((value: string) => {
    setNewRule(prev => ({...prev, proxyGroup: value}))
  }, [])

  // 添加新规则
  const onAdd = React.useCallback(async () => {
    if (!newRule.type || !newRule.domain || !newRule.proxyGroup) {
      toast.warning("规则缺少必要的信息")
      return
    }

    // 拼接为完整规则后发送到服务端
    const ruleStr = `- ${newRule.type},${newRule.domain},${newRule.proxyGroup}`
    if (!(await addRule(ruleStr))) {
      return
    }

    // 添加完成，重置数据，并提示完成
    await refetch()
    setNewRule(defaultValue)
  }, [newRule, refetch])

  // 发起操作 Clash 的请求
  const onExecClash = React.useCallback(async (cmd: Cmd, title: string) => {
    // 路由器执行重启命令需要时间，先提示正在重启
    toast.info(`开始${title}...`)

    const data = {data: true}
    await doAjax(`/api/clash/manager/${cmd}`, data)
  }, [])

  // 规则的类型列表。如"DOMAIN-SUFFIX"
  const ruleTypes = React.useMemo(() => RuleTypes.map(p =>
    <SelectItem value={p} key={p}>{p}</SelectItem>), [])

  // 自定义的规则列表
  const rules = React.useMemo(() => {
    if (!data || !data.data) {
      return []
    }

    // 根据输入的域名，显示是否已存在
    return data.data.rules.filter(p => p.includes(newRule.domain)).map(p =>
      (<RuleItem data={data} rule={p} refetch={refetch} key={p}/>)
    )
  }, [data, newRule.domain, refetch])

  // 分流规则的代理组
  const proxyGroups = React.useMemo(() => {
    if (!data || !data.data) {
      return []
    }

    return data.data.proxyGroups.map(p => <SelectItem value={p} key={p}>{p}</SelectItem>)
  }, [data])

  // 处理请求数据
  if (isLoading || error) {
    return <LoadingOrError isLoading={isLoading} error={error}/>
  }

  return (
    <div className={"flex flex-col gap-4 h-full pb-14"}>
      <Card>
        <CardHeader>管理 Clash</CardHeader>
        <CardContent className={"flex flex-row gap-4"}>
          <Button onClick={() => onExecClash(cmdStart, "运行/重启 Clash")}>运行/重启</Button>

          <Button onClick={() => onExecClash(cmdStop, "停止 Clash")}>停止</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>添加规则</CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          <Input type="text" placeholder="域名，如 abc.example.com" value={newRule.domain} onChange={onDomainChange}/>
          <div className={"flex flex-row gap-2"}>
            <div className={"flex-1"}><Select onValueChange={onTypeChange}>
              <SelectTrigger className=""><SelectValue placeholder="规则类型"/></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>类型</SelectLabel>
                  {ruleTypes}
                </SelectGroup>
              </SelectContent>
            </Select></div>

            <div className={"flex-1"}><Select onValueChange={onProxyGroupChange}>
              <SelectTrigger className=""><SelectValue placeholder="分流规则"/></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>分流</SelectLabel>
                  {proxyGroups}
                </SelectGroup>
              </SelectContent>
            </Select></div>

            <Button className={"flex-1"} onClick={onAdd}>添加</Button>
          </div>
        </CardContent>
      </Card>

      <Card className={"flex flex-col min-h-0 h-full"}>
        <CardHeader>已添加规则</CardHeader>
        <CardContent className={"flex flex-col gap-1 overflow-y-auto"}>{rules}</CardContent>
      </Card>
    </div>
  )
})

export default RuleManager