import { type Key, type Props, type Ref } from 'shared/ReactTypes'
import { type Container } from 'hostConfig'
import { type workTags } from './workTags'
import { type Flags, NoFlags } from './fiberFlags'

export class FiberNode {
  key: Key
  ref: Ref
  tag: workTags
  statusNode: any
  type: any

  return: FiberNode | null
  child: FiberNode | null
  sibling: FiberNode | null
  index: number

  pendingProps: Props
  memoizedProps: Props | null
  memoizedState: any | null
  updateQueue: any

  alternate: FiberNode | null
  flags: Flags

  constructor (tag: workTags, pendingProps: Props, key: Key) {
    /**
     * 作为数据存储
     */
    this.key = key
    this.ref = null
    // 工作节点的Tag类型
    this.tag = tag
    // 对于tag为5(HostComponent的div)，statusNode就表示div的DOM
    this.statusNode = null
    // 对于tag为1(FunctionComponent)，type就表示函数本身() => {}
    this.type = null

    /**
     * 表达节点之间的关系，构成树状结构
     */
    // 指向父FiberNode
    this.return = null
    // 指向子FiberNode
    this.child = null
    // 指向相邻FiberNode
    this.sibling = null
    // 兄弟节点的顺序
    this.index = 0

    /**
     * 作为工作单元
     */
    // 准备工作时的状态
    this.pendingProps = pendingProps
    // 完成工作时的状态
    this.memoizedProps = null
    // 完成工作时的状态
    this.memoizedState = null
    // 更新队列
    this.updateQueue = null

    // 指向workInProgress和current
    this.alternate = null
    // 副作用
    this.flags = NoFlags
  }
}

export class FiberRootNode {
  container: Container
  // 指向当前的HostRootFiber
  current: FiberNode
  // 指向更新完成的HostRootFiber
  finishedWork: FiberNode | null

  // 见https://fastly.jsdelivr.net/gh/zangguojun/tuchuang@main/16761940353241676194034999.png
  constructor (container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.statusNode = this
    this.finishedWork = null
  }
}

/**
 * 创建wip，也就是另一个 HostRootFiber，两者通过alternate连接
 * @param current 也就是现在展示的HostRootFiber
 * @param pendingProps
 */
export const createWorkInProcess = (current: FiberNode, pendingProps: Props): FiberNode => {
  let wip = current.alternate
  if (wip === null) {
    // mount（首屏渲染）
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.statusNode = current.statusNode

    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = current.pendingProps
    wip.flags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedState = current.memoizedState
  wip.memoizedProps = current.memoizedProps

  return wip
}
