import request from '@/utils/request'

// 获取文章分类
export const reqGetInstagramList = (params) => request({ url: '/admin/v1/instagrams', params, method: 'get' });
