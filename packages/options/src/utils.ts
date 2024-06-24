export function exportJSON(config: object, name = 'data.json') {
  // 将 JSON 数据转换为字符串
  const jsonString = JSON.stringify(config, null, 2)
  // 创建一个 Blob 对象
  const blob = new Blob([jsonString], {
    type: 'application/json',
  })
  // 创建一个链接元素
  const link = document.createElement('a')
  // 创建一个对象 URL
  const url = URL.createObjectURL(blob)
  // 设置链接的 href 属性
  link.href = url
  // 设置下载文件的名称
  link.download = name
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
