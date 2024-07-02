import _mergeWith from 'lodash/mergeWith.js'

/**
 * lodash 的 merge 方法在合并对象时，会跳过值为 undefined 的字段，举例：
 * ```js
 * _.merge({ a: 1 }, { a: undefined }) // { a: 1 }
 * ```
 * 但是在我们的场景下，undefined 也是一种合法的值，所以我们需要一个新的合并策略，即：
 * ```js
 * mergeWithUndefined({ a: 1 }, { a: undefined }) // { a: undefined }
 * ```
 * @param dest 目标对象
 * @param src 源对象
 */
export function mergeWithUndefined(dest: unknown, ...src: unknown[]) {
  return _mergeWith(
    dest,
    ...src,
    (objValue: unknown, srcValue: unknown, key: string, object: any) => {
      if (srcValue === undefined) {
        // 不能写成 `return undefined`，这就跟没有返回值一样，会导致 lodash 使用默认合并策略
        object[key] = undefined
      }
    },
  )
}
