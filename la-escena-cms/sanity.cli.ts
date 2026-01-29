import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'amu3sr0m',
    dataset: 'production'
  },
  deployment: {
    appId: 'p12cgd8x1ykkwfkaxtbgeh3k',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
