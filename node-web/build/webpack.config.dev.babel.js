import baseConfig, { DEV_PATH, resolve } from './webpack.config.base';

import path from 'path';
import { theme } from './theme';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

const PORT = 7777; // 服务器端口
const HOST = '0.0.0.0'; // '127.0.0.1';

export default webpackMerge(baseConfig, {
    entry: [
        // 'react-hot-loader/patch', //  开启react代码的模块热替换（HMR）
        'webpack-dev-server/client?http://' + HOST + ':' + PORT, //  为webpack-dev-server的环境打包好运行代码
        'webpack/hot/only-dev-server', // 为热替换（HMR）打包好运行代码,//  only- 意味着只有成功更新运行代码才会执行热替换（HMR）
        resolve('../dev/index.jsx')
    ],
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                include: resolve('../node_modules'),
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { sourceMap: true, javascriptEnabled: true, modifyVars: theme } }
                ]
            },
            {
                test: /\.(css|less)$/,
                include: DEV_PATH,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { sourceMap: true, javascriptEnabled: true, modifyVars: theme } }
                ]
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // 出错不终止插件
        new webpack.NoEmitOnErrorsPlugin(),
        // 配置全局变量
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin() // 热加载插件
    ],
    devServer: {
        // 服务器
        host: HOST,
        port: PORT,
        inline: true,
        hot: true,
        historyApiFallback: true, // using html5 router.
        contentBase: resolve('../dist'),
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7770',
                changeOrigin: true
            },
            '/file': {
                target: 'http://127.0.0.1:7770',
                changeOrigin: true
            }
        }
    }
});
