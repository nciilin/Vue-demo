const map = {
  202: '用户名已被占用',
  217: '无效的用户名',
  210: '用户名和密码不匹配',
  211: '找不到该用户',
  unknown: '请求失败，请稍后再试'
}
export default function ({ code }) {
  return map[code] || map.unknown
}