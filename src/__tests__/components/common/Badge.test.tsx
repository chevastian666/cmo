import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge, BadgeGroup } from '@/components/common/Badge';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-700');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-green-500/20');

    rerender(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-red-500/20');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-yellow-500/20');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="xs">XS Badge</Badge>);
    expect(screen.getByText('XS Badge')).toHaveClass('text-xs');

    rerender(<Badge size="lg">LG Badge</Badge>);
    expect(screen.getByText('LG Badge')).toHaveClass('text-lg');
  });

  it('renders removable badge with close button', () => {
    const onRemove = vi.fn();
    render(<Badge removable onRemove={onRemove}>Removable</Badge>);
    
    const closeButton = screen.getByRole('button', { name: /remove/i });
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders with custom icon', () => {
    render(
      <Badge icon={<span data-testid="custom-icon">🎯</span>}>
        With Icon
      </Badge>
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

describe('BadgeGroup Component', () => {
  it('renders multiple badges', () => {
    render(
      <BadgeGroup>
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </BadgeGroup>
    );

    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.getByText('Badge 3')).toBeInTheDocument();
  });

  it('limits visible badges when maxVisible is set', () => {
    render(
      <BadgeGroup maxVisible={2}>
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
        <Badge>Badge 4</Badge>
      </BadgeGroup>
    );

    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('Badge 3')).not.toBeInTheDocument();
  });
});