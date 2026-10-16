import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CircleSwitch, PopAlert, Slider, SmoothButton, TopAlert } from '../src';

afterEach(() => vi.useRealTimers());

describe('React component behavior', () => {
  it('activates a button with the keyboard and respects disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const view = render(<SmoothButton onClick={onClick}>Hello</SmoothButton>);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    view.rerender(<SmoothButton disabled onClick={onClick}>Hello</SmoothButton>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps controlled switches controlled and supports uncontrolled toggles', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(<CircleSwitch aria-label="Mode" checked={false} onCheckedChange={change} />);
    await user.click(screen.getByRole('switch'));
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    view.rerender(<CircleSwitch aria-label="Mode" checked onCheckedChange={change} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    view.unmount();
    render(<CircleSwitch aria-label="Mode" defaultChecked />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('supports positive minima, clamping, and controlled range updates', () => {
    const change = vi.fn();
    const view = render(<Slider aria-label="Amount" min={10} max={20} defaultValue={15} onValueChange={change} />);
    const input = screen.getByRole('slider');
    expect(input).toHaveValue('15');
    fireEvent.change(input, { target: { value: '17' } });
    expect(change).toHaveBeenCalledWith(17);
    expect(input).toHaveValue('17');
    view.rerender(<Slider aria-label="Amount" min={10} max={20} value={40} onValueChange={change} />);
    expect(input).toHaveValue('20');
    fireEvent.change(input, { target: { value: '12' } });
    expect(input).toHaveValue('20');
    view.rerender(<Slider aria-label="Amount" min={20} max={10} />);
    expect(input).toHaveValue('20');
  });

  it('requests notification dismissal once and retains its exit animation', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const view = render(<TopAlert open onOpenChange={change} title="Saved" duration={1000} />);
    act(() => vi.advanceTimersByTime(999));
    expect(change).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    view.rerender(<TopAlert open={false} onOpenChange={change} title="Saved" duration={1000} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not restart timers when the callback identity changes', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const view = render(<TopAlert open onOpenChange={() => change()} title="Saved" duration={1000} />);
    act(() => vi.advanceTimersByTime(600));
    view.rerender(<TopAlert open onOpenChange={() => change()} title="Updated" duration={1000} />);
    act(() => vi.advanceTimersByTime(400));
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('cancels pending notification timers on unmount and supports persistent alerts', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const view = render(<TopAlert open onOpenChange={change} title="Saved" duration={0} />);
    act(() => vi.advanceTimersByTime(10000));
    expect(change).not.toHaveBeenCalled();
    view.rerender(<TopAlert open onOpenChange={change} title="Saved" duration={1000} />);
    view.unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(change).not.toHaveBeenCalled();
  });

  it('labels dialogs, handles Escape requests, and runs an action before closing', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const change = vi.fn(() => order.push('close'));
    render(<PopAlert open onOpenChange={change} title="Continue?" actions={[
      { label: 'Go', onClick: () => order.push('action') },
    ]}>A description.</PopAlert>);
    const dialog = screen.getByRole('dialog', { name: 'Continue?' });
    expect(dialog).toHaveAccessibleDescription('A description.');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(change).toHaveBeenCalledWith(false);
    order.length = 0;
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(order).toEqual(['action', 'close']);
  });

  it('cleans up dialog presence after closing', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const view = render(<PopAlert open onOpenChange={change} title="Window" />);
    view.rerender(<PopAlert open={false} onOpenChange={change} title="Window" />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-open', 'false');
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
