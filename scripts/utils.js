import * as path from 'path'
import * as fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

// packages路径
const pkgPath = path.resolve(__dirname, '../../packages')
// 产物路径
const distPath = path.resolve(__dirname, '../../dist/node_modules')
// 获取packages/{pkgName}文件夹
export const resolvePkgPath = (pkgName, isDist = false) => `${isDist ? distPath : pkgPath}/${pkgName}`
// 获取packages/{pkgName}/package.json文件
export const getPackageJson = (pkgName) => {
  const pkgPath = `${resolvePkgPath(pkgName)}/package.json`
  const pkgStr = fs.readFileSync(pkgPath, { encoding: 'utf-8' })
  return JSON.parse(pkgStr)
}
// 获取BaseRollupPlugins
export const getBaseRollupPlugins = (options) => {
  const { typescript = {} } = options ?? {}
  return [
    cjs(),
    ts(typescript)
  ]
}
