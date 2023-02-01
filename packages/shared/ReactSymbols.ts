/**
 * modify from
 * const supportSymbol: boolean = typeof Symbol === 'function' && Symbol.for
 * 是否支持symbol
 */
const supportSymbol: boolean = (typeof Symbol === 'function' && Symbol.for) as boolean

/**
 * $$typeof: REACT_ELEMENT_TYPE
 * 为了防止滥用ReactElement
 */
export const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.createElement') : 0xeac7
