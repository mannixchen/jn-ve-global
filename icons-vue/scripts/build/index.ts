import { series, parallel } from 'gulp'
import { clean, generateVue, buildModules, buildFull, generateTypes } from './tasks'

export default series(
    clean,
    generateVue,
    series(parallel(buildModules, buildFull), generateTypes)
) as any
