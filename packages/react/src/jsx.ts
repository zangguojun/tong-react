import { type Type, type Key, type Ref, type Props, type ReactElementType, type ElementType } from 'shared/ReactTypes'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'

/**
 * 创建ReactElement数据结构
 * @param type div、span...
 * @param key
 * @param ref
 * @param props
 * @constructor
 */
export const ReactElement = (type: Type, key: Key, ref: Ref, props: Props): ReactElementType => {
  return {
    type,
    key,
    ref,
    props,
    $$typeof: REACT_ELEMENT_TYPE,
    // 此字段为人为标记
    __mark: 'tong'
  }
}
/**
 * jsx 和 jsxDEV 区别在于；jsx不处理maybeChildren
 * @param type
 * @param config
 * @param maybeChildren
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any[]): ReactElementType => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}
  for (const prop in config) {
    const val = config[prop]
    /**
     * key 和 ref 需要特殊处理
     */
    if (props === 'key') {
      if (val !== undefined) {
        // key = "" + val
        key = String(val)
      }
      continue
    }

    if (props === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }

    const maybeChildrenLength = maybeChildren.length
    if (maybeChildrenLength !== 0) {
      if (maybeChildrenLength === 1) {
        props.children = maybeChildren[0]
      } else {
        props.children = maybeChildren
      }
    }
  }
  return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, config: any): ReactElementType => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}
  for (const prop in config) {
    const val = config[prop]
    if (props === 'key') {
      if (val !== undefined) {
        // key = "" + val
        key = String(val)
      }
      continue
    }

    if (props === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }
  return ReactElement(type, key, ref, props)
}
