/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-12-01 11:09:49
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-12-01 11:13:29
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\utils\utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { TableConfig } from '../../GTable/interface'

export const getTableHeight = async (config: TableConfig<any>) => {
    const { clientHeight: height } = await config.instance.getTableHeight()
    return { height }
}
