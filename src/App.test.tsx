import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('aplicação', () => {
  it('apresenta a página inicial do projeto', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'DSSI Web' })).toBeInTheDocument()
  })
})
