import { type GuiConfig } from './type.js'
import { produce } from 'immer'
import _isEmpty from 'lodash/isEmpty.js'

/**
 * 导出 JSON 配置
 * @param config
 * @param name
 */
export function exportJSON(config: object, name = 'data.json') {
  // 将 JSON 数据转换为字符串
  const jsonString = JSON.stringify(config, null, 2)

  exportFile([jsonString], {
    type: 'application/json',
    name,
  })
}

export function exportFile(
  data: BlobPart[],
  options?: {
    type?: string
    name?: string
  },
) {
  // 创建一个 Blob 对象
  const blob = new Blob(data, {
    type: options?.type,
  })
  // 创建一个链接元素
  const link = document.createElement('a')
  // 创建一个对象 URL
  const url = URL.createObjectURL(blob)
  // 设置链接的 href 属性
  link.href = url
  // 设置下载文件的名称
  link.download = options?.name || ''
  // 将链接元素添加到文档中
  document.body.appendChild(link)
  // 触发点击事件下载文件
  link.click()
  // 从文档中移除链接元素
  document.body.removeChild(link)
  // 释放对象 URL
  URL.revokeObjectURL(url)
}

export function importJSON() {
  return new Promise<unknown>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.oncancel = () => {
      reject('User canceled')
    }
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject('No file selected')
        return
      }
      const reader = new FileReader()
      reader.onload = function (e) {
        try {
          const json = JSON.parse(e.target?.result as string)
          resolve(json)
        } catch (error) {
          reject('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}

// 遍历整个对象，删除值为 null / undefined / 空对象的字段，保留其它类型的值如数字和数组。
//
// 如果值是一个数组，则删除其中的空字符串
function clean(obj: any) {
  // console.log('开始遍历对象：', JSON.stringify(obj))
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      // console.log('null / undefined，删除字段：', key)
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        // const l = obj[key].length
        obj[key] = obj[key].filter((x) => x !== '')
        // if (obj[key].length < l) {
        //   console.log('删除 ' + key + ' 数组中的空字符串')
        // }
      } else {
        clean(obj[key])
      }
      if (_isEmpty(obj[key]) && !Array.isArray(obj[key])) {
        // console.log('删除空对象', key)
        delete obj[key]
      }
    }
  }
}

function getPort() {
  const port = location.port
  return port ? parseInt(port, 10) : location.protocol === 'https:' ? 443 : 80
}

/**
 * 对配置进行规范化
 * @param config
 */
export function normalize(config: GuiConfig) {
  return produce(config, (draft) => {
    if (draft.gui) {
      // 以前的版本中的 publicIP 和 port 改为 publicURL
      if (!draft.gui.publicURL && draft.gui.publicIP) {
        draft.gui.publicURL = `http://${draft.gui.publicIP}:${draft.gui.port || getPort()}`
      }
      delete draft.gui.publicIP
      delete draft.gui.port
    }
  })
}

/**
 * 删掉配置中的空配置如 null / undefined / 空对象 / 数组中的空字符串
 *
 * 仅当在需要展示配置给用户看的时候使用
 *
 * @param config
 */
export function strip(config: GuiConfig) {
  return produce(config, (draft) => {
    // 删除 null / undefined / 空对象 / 数组中的空字符串
    clean(draft)
  })
}

/**
 * 判断是否是本地地址
 * @param url
 */
export function isLocalhost(url: string) {
  return url.includes('localhost') || url.includes('127.0.0.1')
}
