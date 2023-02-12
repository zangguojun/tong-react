// Fiber Node是什么类型的节点
export type workTags = typeof FunctionComponent | typeof HostRoot | typeof HostComponent | typeof HostText

export const HostRoot = 3

/**
 * function App () {}
 * <App /> 为FunctionComponent
 */
export const FunctionComponent = 0

/**
 * <div>123</div>
 * + div为HostComponent
 * + 123为HostText
 */
export const HostComponent = 5
export const HostText = 6
