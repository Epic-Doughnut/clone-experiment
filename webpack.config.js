const path = require('path');

module.exports = {
    entry: './scripts/main.js', // Your main JS file
    output: {
        filename: 'bundle.js', // The bundled JS file
        path: path.resolve(__dirname, 'dist') // Where it will be saved
    },
    module: {
        rules: [
            // Add loaders as necessary
        ]
    },
    plugins: [
        // Add plugins as necessary
    ],
    devServer: {
        contentBase: './dist'
    },
    devtool: 'inline-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
