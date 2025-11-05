import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card container', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      render(<Card className="custom-card" data-testid="custom-card">Content</Card>)
      const card = screen.getByTestId('custom-card')
      expect(card).toHaveClass('custom-card')
    })

    it('should have data-slot attribute', () => {
      render(<Card data-testid="test-card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('data-slot', 'card')
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      )
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardHeader data-testid="test-header">Header</CardHeader>
        </Card>
      )
      const header = screen.getByTestId('test-header')
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="test-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByTestId('test-title')
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })

    it('should apply font-semibold class', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="test-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByTestId('test-title')
      expect(title).toHaveClass('font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="test-desc">Desc</CardDescription>
          </CardHeader>
        </Card>
      )
      const desc = screen.getByTestId('test-desc')
      expect(desc).toHaveAttribute('data-slot', 'card-description')
    })
  })

  describe('CardAction', () => {
    it('should render card action', () => {
      render(
        <Card>
          <CardHeader>
            <CardAction>
              <button type="button">Action</button>
            </CardAction>
          </CardHeader>
        </Card>
      )
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardHeader>
            <CardAction data-testid="test-action">Action</CardAction>
          </CardHeader>
        </Card>
      )
      const action = screen.getByTestId('test-action')
      expect(action).toHaveAttribute('data-slot', 'card-action')
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent>Content Area</CardContent>
        </Card>
      )
      expect(screen.getByText('Content Area')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardContent data-testid="test-content">Content</CardContent>
        </Card>
      )
      const content = screen.getByTestId('test-content')
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      render(
        <Card>
          <CardFooter data-testid="test-footer">Footer</CardFooter>
        </Card>
      )
      const footer = screen.getByTestId('test-footer')
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
    })
  })

  describe('Complete Card', () => {
    it('should render all card components together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>
              <button type="button">Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>Main Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
    })
  })
})

