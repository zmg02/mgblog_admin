import Cookies from 'js-cookie'

const TokenKey = 'mgblog_admin_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires) {
  return Cookies.set(TokenKey, token, { expires: expires})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 将expiresAt过期时间写入cookie
const expiresAtKey = 'mgblog_admin_expires_at'

export function getExpires() {
    return Cookies.get(expiresAtKey)
}

export function setExpires(expiresAt, expires) {
    return Cookies.set(expiresAtKey, expiresAt, { expires: expires })
}

export function removeExpires() {
    return Cookies.remove(expiresAtKey)
}