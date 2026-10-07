import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { BotanicalBranch, LeafSprig, PillIcon } from '../components/Botanical';

describe('Base44 Botanical SVG Components', () => {
  it('renders BotanicalBranch as an accessible SVG element', () => {
    const { container } = render(<BotanicalBranch className="test-branch" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('test-branch');
  });

  it('renders LeafSprig with correct SVG paths', () => {
    const { container } = render(<LeafSprig className="test-sprig" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('test-sprig');
  });

  it('renders PillIcon with pill geometric dimensions', () => {
    const { container } = render(<PillIcon className="test-pill" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('test-pill');
  });
});
