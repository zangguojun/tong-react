import { createWorkInProcess, type FiberNode, type FiberRootNode } from './fiber'
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { HostRoot } from './workTags'

let workInProgress: FiberNode | null = null

export const scheduleUpdateOnFiber = (fiber: FiberNode): void => {
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root as FiberRootNode)
}

/**
 * 找到根FiberNode节点
 * @param fiber
 */
const markUpdateFromFiberToRoot = (fiber: FiberNode): FiberRootNode | null => {
  // 当前节点
  let node = fiber
  // 当前节点的父节点
  let parent = fiber.return
  while (parent !== null) {
    // 存在parent，则为普通FiberNode
    node = parent
    parent = parent.return
  }
  // 说明不为普通FiberNode
  if (node.tag === HostRoot) {
    // 说明为 HostRootFiber
    return node.statusNode
  }

  return null
}

/**
 * 调用者为触发更新的api，如render、state
 * @param root
 */
const renderRoot = (root: FiberRootNode): void => {
  // 初始化
  prepareRefreshStack(root)

  do {
    try {
      workLoop()
      break
    } catch (e) {
      console.error('WorkLoop Error', e)
      workInProgress = null
    }
  } while (true)
}

/**
 * 将wip设置为第一个遍历的Fiber Node
 * @param root
 */
const prepareRefreshStack = (root: FiberRootNode): void => {
  // FiberRootNode并不是一个普通的Fiber，不能直接作为wip
  workInProgress = createWorkInProcess(root.current, {})
}

const workLoop = (): void => {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

/**
 * 递 阶段
 */
const performUnitOfWork = (fiber: FiberNode): void => {
  // 有子节点 遍历子节点
  const next = beginWork(fiber)
  fiber.memoizedProps = fiber.pendingProps
  // 说明 递 结束了；准备开始 归 了
  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = fiber
  }
}

/**
 * 归 阶段
 */
const completeUnitOfWork = (fiber: FiberNode | null) => {
  let node: FiberNode | null = fiber
  do {
    // 没有子节点 遍历兄弟节点以及父节点
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = node
  } while (node !== null)
}
