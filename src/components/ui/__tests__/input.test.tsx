import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should accept and display value', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'test value')
    expect(input).toHaveValue('test value')
  })

  it('should handle onChange event', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is passed', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should display placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should accept different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('should have data-slot attribute', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('should support aria-invalid attribute', () => {
    render(<Input aria-invalid="true" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should support required attribute', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should support readonly attribute', () => {
    render(<Input readOnly value="readonly text" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxLength', '10')
  })

  it('should support default value', () => {
    render(<Input defaultValue="default text" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('default text')
  })

  it('should focus on input when autoFocus is true', () => {
    render(<Input autoFocus />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })
})

