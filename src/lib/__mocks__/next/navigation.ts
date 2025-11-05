export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}))

export const usePathname = jest.fn(() => '/')

export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
}))

export const useParams = jest.fn(() => ({}))

export const redirect = jest.fn()

