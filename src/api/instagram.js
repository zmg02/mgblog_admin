import request from '@/utils/request'

// 获取文章分类
export const reqGetInstagramList = (params) => request({ url: '/admin/v1/instagrams', params, method: 'get' });

// 上传图片
export const reqPostInstagram = (data) => request({url: '/admin/v1/instagrams/upload', data, method: 'post'});