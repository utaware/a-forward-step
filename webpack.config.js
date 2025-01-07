import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: 'bundle.cjs',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
    // Critical dependency: require function is used in a way in which dependencies cannot be statically extracted的问题
    unknownContextCritical : false,
    // the request of a dependency is an expression
    exprContextCritical: false,
  },
  resolve: {
    alias: {
      '#types': resolve(__dirname, 'src/types'),
      '#utils': resolve(__dirname, 'src/utils'),
      '#girigiri': resolve(__dirname, 'src/girigiri'),
      '#m3u8': resolve(__dirname, 'src/m3u8'),
      '#config': resolve(__dirname, 'src/config'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: [resolve(__dirname, 'src'), 'node_modules'],
  },
}
