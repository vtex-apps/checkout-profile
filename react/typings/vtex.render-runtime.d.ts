import * as Runtime from 'vtex.render-runtime'

declare module 'vtex.render-runtime' {
  export const useRuntime: () => Runtime.RenderContext
}
