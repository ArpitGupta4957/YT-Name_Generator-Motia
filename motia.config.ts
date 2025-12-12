import { defineConfig } from '@motiadev/core'
import endpointPlugin from '@motiadev/plugin-endpoint/plugin'
import logsPlugin from '@motiadev/plugin-logs/plugin'
import observabilityPlugin from '@motiadev/plugin-observability/plugin'
import statesPlugin from '@motiadev/plugin-states/plugin'
import bullmqPlugin from '@motiadev/plugin-bullmq/plugin'
import { steps } from 'tutorial'

export const config = defineConfig({
  plugins: [endpointPlugin, logsPlugin, observabilityPlugin, statesPlugin, bullmqPlugin],
})

export default{
  name: 'motia-project',
  steps: './steps'
}
