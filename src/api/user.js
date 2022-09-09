import request from '@/utils/request'

// 后台用户登录
export const reqLogin = (data) => request({ url: '/admin/v1/login', data, method: 'post' });
// 后台所有菜单
export const fetchMenu = (params) => request({ url: '/admin/v1/menus', params, method: 'get' });
// 登录用户的权限
export const reqGetPermissions = () => request({ url: '/admin/v1/users/permissions', method: 'get' });
// 刷新token，3600秒过期
export const reqRefreshToken = () => request({ url: '/admin/v1/refresh', method: 'post' });
// 获取后台登录用户信息
export const reqGetInfo = () => request({ url: '/admin/v1/me', method: 'post' });
// 退出登录
export const reqLogout = () => request({ url: '/admin/v1/logout', method: 'post' });

// 获取用户状态列表
export const reqUserStatus = () => request({ url: '/admin/v1/users/status', method: 'get' });
// 获取用户列表
export const reqUserList = (params) => request({ url: '/admin/v1/users', params, method: 'get' });
// 修改用户信息
export const reqPostUser = (data) => request({ url: `/admin/v1/users`, data, method: 'post' });
// 修改用户信息
export const reqPutUser = (userId, data) => request({ url: `/admin/v1/users/${userId}`, data, method: 'put' });
// 删除用户
export const reqDelUser = (userId) => request({ url: `/admin/v1/users/${userId}`, method: 'delete' });
// 验证用户
export const reqVerify = (data) => request({ url: '/admin/v1/users/verify', data, method: 'patch' });
// 拉黑用户
export const reqBlacklist = (data) => request({ url: '/admin/v1/users/blacklist', data, method: 'patch' });
// 删除用户(批量)
export const reqDestroy = (data) => request({ url: '/admin/v1/users/destroy_selected', data, method: 'patch' });
// 上传头像
export const reqUpload = (data) => request({ url: '/admin/v1/users/upload', data, method: 'post' });


/**
 * 用户权限
 */
 export const reqGetUserPermission = (userId) => request({ url: `/admin/v1/users/${userId}/permissions`, method: 'get' });
 // 保存用户权限
 export const reqPostUserPermission = (userId, data) => request({ url: `/admin/v1/users/${userId}/permissions`, data, method: 'post' });
 
// export default {
//   reqLogin(data) {
//     return request.post('/api/v1/login', data);
//   },
//   reqGetInfo(userId) {
//     return request.get(`/api/v1/users/${userId}`, data);
//   },
//   reqLogout() {
//     return request.post('/api/v1/logout');
//   }
// }

// export function reqLogin(data) {
//   return request({
//     url: '/api/v1/login',
//     method: 'post',
//     data
//   })
// }

