import { http, createConfig } from '@wagmi/core'
import { goerli } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [goerli],
  transports: {
    [goerli.id]: http(),
  },
  ssr: true,
})