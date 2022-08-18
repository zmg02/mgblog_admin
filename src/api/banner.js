import request from '@/utils/request'

// 获取轮播图
export const reqGetBanner = () => request({ url: '/admin/v1/banners', method: 'get' })
export const reqDelBanner = (id) => request({ url: `/admin/v1/banners/${id}`, method: 'delete' })
