import request from '@/utils/request'

// 标签列表
export const reqGetTags = () => request({ url: '/admin/v1/tags', method: 'get' });
// 创建标签
export const reqPostTag = (data) => request({ url: '/admin/v1/tags', data, method: 'post' });
// 修改标签
export const reqPutTag = (id, data) => request({ url: `/admin/v1/tags/${id}`, data, method: 'put' });
// 删除标签
export const reqDelTag = (id) => request({ url: `/admin/v1/tags/${id}`, method: 'delete' });