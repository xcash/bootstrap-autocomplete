var config = {
	//watch: true,
	module: {
      loaders: [
        { test: /\.ts?$/, loader: 'ts-loader' },
      ],
    },
    devtool: 'inline-source-map',
	externals: {
		'jquery': 'jQuery'
	},
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension. 
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    // entry: './src',               // entry point
    output: {                     // output folder
        // path: './dist',           // folder path
        filename: '[name].js'     // file name
    }
}
module.exports = config;
