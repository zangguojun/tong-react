import generatePackageJson from 'rollup-plugin-generate-package-json'
import { resolvePkgPath, getPackageJson, getBaseRollupPlugins } from '../utils'

const { name, module } = getPackageJson('react')
// react包的路径
const pkgPath = resolvePkgPath(name)
// react产物的路径
const pkgDistPath = resolvePkgPath(name, true)

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      format: 'umd'
    },
    // 生成PackageJson
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, version, description }) => ({
          name,
          version,
          description,
          main: 'index.js'
        })
      })]
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugins()
  }
]
