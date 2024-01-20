import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Skeleton} from "@/components/ui/skeleton.tsx"
import {AlertCircle} from "lucide-react"

// 加载中/出错组件的属性
interface LoadingOrErrorProps {
  isLoading: boolean
  error: Error | null
}

// 加载中/出错的组件
const LoadingOrError = (props: LoadingOrErrorProps) => {
  const {isLoading, error} = props

  if (isLoading) {
    return <div className={"flex flex-col gap-2"}>
      <Skeleton className="h-4 w-[250px]"/>
      <Skeleton className="h-4 w-[250px]"/>
      <Skeleton className="h-4 w-[250px]"/>
    </div>
  }

  if (error) {
    console.log("加载内容出错", error)
    // toast({title: "加载内容出错", description: error.message, variant: "destructive"})
    return <Alert variant="destructive">
      <AlertCircle className="h-4 w-4"/>
      <AlertTitle>加载内容出错</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  }

  return null
}

export default LoadingOrError