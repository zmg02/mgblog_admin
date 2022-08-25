import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 将expiresAt过期时间写入cookie
const expiresAtKey = 'ExpiresAt'

export function getExpires() {
    return Cookies.get(expiresAtKey)
}

export function setExpires(expiresAt, expires) {
    return Cookies.set(expiresAtKey, expiresAt, { expires: expires })
}

export function removeExpires() {
    return Cookies.remove(expiresAtKey)
}