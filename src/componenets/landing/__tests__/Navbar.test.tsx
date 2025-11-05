import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../Navbar'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

describe('Navbar', () => {
  it('should render navbar with logo', () => {
    render(<Navbar />)
    expect(screen.getByText('Gear Up')).toBeInTheDocument()
    expect(screen.getByAltText('Gear Up Logo')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('should render auth buttons', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
  })

  it('should have correct logo link', () => {
    render(<Navbar />)
    const logoLink = screen.getByText('Gear Up').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('should have correct navigation link hrefs', () => {
    render(<Navbar />)
    
    const servicesLinks = screen.getAllByRole('link', { name: /services/i })
    expect(servicesLinks[0]).toHaveAttribute('href', '/services')
    
    const loginLinks = screen.getAllByRole('link', { name: /login/i })
    expect(loginLinks[0]).toHaveAttribute('href', '/login')
    
    const registerLinks = screen.getAllByRole('link', { name: /get started/i })
    expect(registerLinks[0]).toHaveAttribute('href', '/register')
  })

  it('should toggle mobile menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    
    const menuButton = screen.getByRole('button')
    
    await user.click(menuButton)
    
    const mobileLinks = screen.getAllByRole('link', { name: /services/i })
    expect(mobileLinks.length).toBeGreaterThan(1)
    
    await user.click(menuButton)
    
    const linksAfterClose = screen.getAllByRole('link', { name: /services/i })
    expect(linksAfterClose.length).toBe(1)
  })

  it('should close mobile menu when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    
    const menuButton = screen.getByRole('button')
    await user.click(menuButton)
    
    const mobileLinks = screen.getAllByRole('link', { name: /services/i })
    expect(mobileLinks.length).toBeGreaterThan(1)
    
    await user.click(mobileLinks[1])
    
    const linksAfterClick = screen.getAllByRole('link', { name: /services/i })
    expect(linksAfterClick.length).toBe(1)
  })

  it('should show hamburger icon when menu is closed', () => {
    render(<Navbar />)
    const menuButton = screen.getByRole('button')
    const svg = menuButton.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should have fixed positioning', () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('fixed')
  })
})

