

module.exports = {
    server_port: 80,

    route_info: [
        //===== User =====//
        { file: './user', path: '/', method: 'main2', type: 'get' },
        { file: './user', path: '/', method: 'main', type: 'post' },
        { file: './user', path: '/process/adduser', method: 'adduser', type: 'post' }, // user.adduer
        { file: './user', path: '/process/login', method: 'login', type: 'post' }, // user.login
        { file: './user', path: '/kakao/send', method: 'kakao_send', type: 'get' }, // kakao send
        { file: './user', path: '/check', method: 'check', type: 'get' }, // kakao send
        { file: './user', path: '/user/image', method: 'image', type: 'post' },
        { file: './user', path: '/test', method: 'test', type: 'get' },
        { file: './user', path: '/process/dustinfo', method: 'dust_info', type: 'post' }
    ]
}
