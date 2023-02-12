import { type Action } from 'shared/ReactTypes'

/**
 * 定义 Update 数据结构
 */
export interface Update<State> {
  action: Action<State>
}

/**
 * 定义 UpdateQueue数据结构
 */
export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

/**
 * 创建Update实例
 * @param action
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action
  }
}

/**
 * 创建UpdateQueue的实例
 */
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
  return {
    shared: {
      pending: null
    }
  }
}

/**
 * 向UpdateQueue里面插入Update的方法
 * @param updateQueue
 * @param update
 */
export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
): void => {
  updateQueue.shared.pending = update
}

/**
 * 消费Update的方法
 * @param baseState
 * @param pendingUpdate
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState
  }
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    // 与setState一致
    if (action instanceof Function) {
      result.memoizedState = action(baseState)
    } else {
      result.memoizedState = action
    }
  }
  return result
}
