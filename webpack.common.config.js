const path = require('path');

module.exports = {
    // entry: {
    //     index: path.resolve(__dirname, '/src/app.js'),
    // },
    // output: {
    //     filename: "app.js",
    //     path: path.resolve(__dirname, 'dist')
    // },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 3000,
        open: true,
        hot: true
    }
}