module.exports = {
    publicPath: './',
    assetsDir: './static',
    // 修改的配置
    devServer: {
        proxy: {
            '/api': {
                target: 'http://47.101.205.110:8080/api/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}
