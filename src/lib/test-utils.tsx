import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from './context/AuthContext'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withAuth?: boolean
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { withAuth = false, ...renderOptions } = options || {}
  
  if (withAuth) {
    return render(ui, { wrapper: AllTheProviders, ...renderOptions })
  }
  
  return render(ui, renderOptions)
}

export * from '@testing-library/react'
export { customRender as render }

