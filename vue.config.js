const path = require("path");

function resolve(dir) {
    return path.join(__dirname, "/", dir);
}

module.exports = {
    // publicPath: "/",
    lintOnSave: process.env.NODE_ENV !== "production",
    devServer: {
        port: 3000, // 端口
        overlay: {
            warnings: true,
            errors: false,
        },
        proxy: {
            //設定代理
            "/api": {
                target: "http://msapi.autoware.com.tw/api/", // 介面的域名
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": "" //萬用字元
                }
            }
        },
    },
    configureWebpack: {
        devtool: "source-map",
    },
    // svg配置
    chainWebpack(config) {
        config.module
            .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();
    },
};