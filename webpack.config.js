const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const WriteFilePlugin = require('write-file-webpack-plugin');
// const TSConfigPaths = require('tsconfig-paths-webpack-plugin');

// 打包時略過模組解析的目錄清單(不處理 import、require)。
// const disableCommonjsFolders = [path.resolve(__dirname, 'src/noparse')];

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './index.ts', // 程式進入點。
    output: { //輸出位置。
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsonx.js',
        libraryTarget: 'commonjs'
    },
    target: 'node', // 讓 webpack 以 node 方式處理內鍵 lib，例如：fs, path ...
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        rules: [
            { // 設定 Typescript 轉譯器(https://github.com/TypeStrong/ts-loader)
                test: /\.ts$/,
                use: 'ts-loader',
                // include: [
                //     ...disableCommonjsFolders
                // ],
                parser: {
                    commonjs: true
                }
            },
            // { // 設定 Typescript 轉譯器(https://github.com/TypeStrong/ts-loader)
            //     test: /\.ts$/,
            //     use: 'ts-loader',
            //     exclude: [
            //         ...disableCommonjsFolders
            //     ],
            //     parser: { /** https://webpack.js.org/configuration/module/#rule-parser */
            //         commonjs: true // 關掉指定模組格式的解析(打包)。
            //     }
            // }
    ],
        // noParse: function (content) {
        //     return /^\.\/require$/.test(content);
        // }
    },
    resolve: { // 如果這個沒有設定，TypeScript 會無法處理 import。
        // 需要指定 .js，不然有些東西還是會爆掉。
        extensions: ['.ts', '.js'], // https://webpack.js.org/configuration/resolve/#resolve-extensions
        alias: {
            // rq$: path.resolve(__dirname, 'src/require.ts'),
        },
        plugins: [
            // new TSConfigPaths({configFile: "./tsconfig.json"})
        ]
    },

    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'source-map', // tsconfig.json 也要設定輸出 Source Map 才能運作。

    // https://webpack.js.org/concepts/mode/
    mode: 'development', //設定為開發模式，天曉得會發生什麼事…

    /** 
     * https://webpack.js.org/configuration/dev-server/#devserver
     * https://webpack.js.org/guides/development/#using-webpack-dev-server
     * 有些版本的 webpack-cli 不合會一啟動就爆掉。
     */
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     port: 7210
    // },
    externals: [
        // function (context, request, callback) {
        //     if (/^xxx$/.test(request)) {
        //         return callback(null, 'commonjs ' + request);
        //     }
        //     callback();
        // },
        nodeModules
    ],
    plugins: [
        new CleanWebpackPlugin(['dist']), //每次 build 都會刪掉 dist。
        new CopyWebpackPlugin([
            // { // 直接將指定的資源複製到輸出目錄。
            //     from: 'index.d.ts',
            // }
            ,{
                from: "package.json",
                transform: (content, path) => {
                    // 將 package.json 的某些屬性調整後再複製到 dist 目錄。
                    const pkg = JSON.parse(content.toString('utf8'));
                    pkg.main = './jsonx.js' // 正式環境應該用這個檔案。
                    return Buffer.from(JSON.stringify(pkg,null, 3),"utf8")
                }
            }
        ]),
        // new WriteFilePlugin()
    ],
};
