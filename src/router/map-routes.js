// 路由映射
const mapRoutes = {
    layout:() => import('@/layout'),
    default: () => import('@/views/default'),
    user:() => import('@/views/member/User'),
    author:() => import('@/views/member/Author'),
    admin:() => import('@/views/member/Admin'),
    article:() => import('@/views/article/List'),
    category:() => import('@/views/article/Category'),
    test1:() => import('@/views/test/test1'),
    test1_1:() => import('@/views/test/test1/test1-1'),
    test1_1_1:() => import('@/views/test/test1/test1-1/test1-1-1'),
    test1_1_2:() => import('@/views/test/test1/test1-1/test1-1-2'),
    test1_1_3:() => import('@/views/test/test1/test1-1/test1-1-3'),
    test1_2:() => import('@/views/test/test1/test1-2'),
    test2:() => import('@/views/test/test2'),
    test2_1:() => import('@/views/test/test2/test2-1'),
    test2_2:() => import('@/views/test/test2/test2-2'),
}

export default mapRoutes;