import request from '@/utils/request'

// 获取照片墙
export const reqGetInstagramList = (params) => request({ url: '/admin/v1/instagrams', params, method: 'get' });

// 上传图片
export const reqPostInstagram = (data) => request({url: '/admin/v1/instagrams/upload', data, method: 'post'});
// 获取照片墙状态列表
export const reqInstagramStatus = () => request({ url: '/admin/v1/instagrams/status', method: 'get' });
// 设置图片信息
export const reqSetInstagram = (id,data) => request({ url: `/admin/v1/instagrams/${id}`, data, method: 'put' });