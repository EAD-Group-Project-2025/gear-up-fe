import { render, screen } from '@testing-library/react'
import HeroSection from '../HeroSection'

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

describe('HeroSection', () => {
  it('should render main heading', () => {
    render(<HeroSection />)
    expect(screen.getByText(/gear up your/i)).toBeInTheDocument()
    expect(screen.getByText(/vehicle's future/i)).toBeInTheDocument()
  })

  it('should render description text', () => {
    render(<HeroSection />)
    expect(
      screen.getByText(/professional automotive services/i)
    ).toBeInTheDocument()
  })

  it('should render call-to-action buttons', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /book service now/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore services/i })).toBeInTheDocument()
  })

  it('should have correct button links', () => {
    render(<HeroSection />)
    
    const bookServiceLink = screen.getByRole('link', { name: /book service now/i })
    expect(bookServiceLink).toHaveAttribute('href', '/customer')
    
    const exploreServicesLink = screen.getByRole('link', { name: /explore services/i })
    expect(exploreServicesLink).toHaveAttribute('href', '/services')
  })

  it('should render hero image', () => {
    render(<HeroSection />)
    const image = screen.getByAltText('Gear Up Services')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/hero.png')
  })

  it('should have priority loading for hero image', () => {
    render(<HeroSection />)
    const image = screen.getByAltText('Gear Up Services')
    expect(image).toHaveAttribute('priority')
  })

  it('should have gradient background', () => {
    const { container } = render(<HeroSection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-gradient-to-br')
  })

  it('should use primary and secondary colors in gradient', () => {
    const { container } = render(<HeroSection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('from-primary')
    expect(section).toHaveClass('to-secondary')
  })

  it('should have proper responsive layout classes', () => {
    const { container } = render(<HeroSection />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('lg:grid-cols-2')
  })

  it('should render all content elements', () => {
    render(<HeroSection />)
    
    expect(screen.getByText(/gear up your/i)).toBeInTheDocument()
    expect(screen.getByText(/professional automotive services/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /book service now/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore services/i })).toBeInTheDocument()
    expect(screen.getByAltText('Gear Up Services')).toBeInTheDocument()
  })
})

