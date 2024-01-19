import {toast} from "@/components/ui/use-toast.ts"
import {ToastAction} from "@/components/ui/toast.tsx"

/**
 * 删除数组中的元素，并提供撤销功能
 *
 * @param title 标题。如 “弥珠(162345)”，不需要完整提示
 * @param target 待删除的数据
 * @param dataList 包含待删除元素的数组
 * @param findData 查找待删除数据的索引的回调函数
 * @param update 保存数据、更新（将返回同地址的数组，需要自行创建新数组 [...dataList]）
 */
export const delRevokeArray = <D, >(title: string,
                                    target: D,
                                    dataList: Array<D>,
                                    findData: (d1: D, d2: D) => boolean,
                                    update: (updatedDataList: Array<D>) => void): void => {
  // 查找待删除项目的索引
  const iData = dataList.findIndex(item => findData(item, target))
  if (iData < 0) {
    console.log("删除失败：无法找到待删除元素的索引", "data:", target, "dataList:", dataList)
    toast({description: `删除失败'${title}'：无法找到待删除元素的索引`, variant: "destructive"})
    return
  }

  // 正式删除元素，并保存被删除的元素，以便恢复
  const deledDataList = dataList.splice(iData, 1)

  // 保存修改、更新界面，如保存到 chromium storage
  update(dataList)

  // 显示撤销删除的按钮
  toast({
    description: `是否恢复数据'${title}'`, action: <ToastAction altText={"恢复"} onClick={() => {
      // 恢复项目
      dataList.splice(iData, 0, deledDataList[0])
      update(dataList)

      toast({description: "已恢复数据"})
    }}>恢复</ToastAction>
  })
}
