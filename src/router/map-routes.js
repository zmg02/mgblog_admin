// 路由映射
const mapRoutes = {
    layout:() => import('@/layout'),
    default: () => import('@/views/default'),
    user:() => import('@/views/member/User'),
    author:() => import('@/views/member/Author'),
    admin:() => import('@/views/member/Admin'),
    article:() => import('@/views/article/List'),
    category:() => import('@/views/article/Category'),
    role:() => import('@/views/set/Role'),
    menu:() => import('@/views/set/Menu'),
    permission:() => import('@/views/set/Permission'),
    www:() => import('@/views/set/WWW'),
    banner:() => import('@/views/set/WWW/Banner'),
    instagram:() => import('@/views/set/WWW/Instagram'),
}

export default mapRoutes;