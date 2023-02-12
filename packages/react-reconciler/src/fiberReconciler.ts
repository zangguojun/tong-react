import { type ReactElementType } from 'shared/ReactTypes'
import { type Container } from 'hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'

/**
 * React.createRoot(DOM).render(<App/>)
 */
/**
 * 执行createRoot(DOM)方法时调用
 * @param container
 */
export const createContainer = (container: Container): FiberRootNode => {
  // 新建 hostRootFiber 和 FiberRootNode，并将两者产生关联
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)
  // 给hostRootFiber创建updateQueue（连接 更新机制）
  hostRootFiber.updateQueue = createUpdateQueue()
  return root
}

/**
 * 执行render(<App/>)方法时调用
 * @param element ReactElement
 * @param root
 */
export const updateContainer = (element: ReactElementType | null, root: FiberRootNode): ReactElementType | null => {
  const hostRootFiber = root.current
  // 创建一个element相关的Update
  const update = createUpdate(element)
  // 将上述Update插入hostRootFiber的UpdateQueue
  enqueueUpdate(hostRootFiber.updateQueue, update)
  // 在Fiber中调度Update（连接Container和renderRoot）
  scheduleUpdateOnFiber(hostRootFiber)
  return element
}
