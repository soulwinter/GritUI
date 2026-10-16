'use client';

import {
  useEffect, useId, useRef, useState,
  type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type Variables = CSSProperties & { [name: `--grit-${string}`]: string | number };
const orange = '#ff8600';
const classes = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref;
}

function usePresence(open: boolean, exitDuration: number) {
  const [present, setPresent] = useState(open);
  useEffect(() => {
    if (open) { setPresent(true); return; }
    const timer = window.setTimeout(() => setPresent(false), exitDuration);
    return () => window.clearTimeout(timer);
  }, [open, exitDuration]);
  return present;
}

export interface SmoothButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  fontSize?: number;
}

/** A pill button with the original 200 ms touch-origin highlight. */
export function SmoothButton({ color = orange, fontSize = 20, className, style, children,
  onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onKeyDown, onKeyUp, onBlur,
  ...props }: SmoothButtonProps) {
  const [ripple, setRipple] = useState({ key: 0, x: '50%', y: '50%' });
  const [pressed, setPressed] = useState(false);
  const start = (x: string, y: string) => {
    setRipple(previous => ({ key: previous.key + 1, x, y }));
    setPressed(true);
  };
  return <button {...props} type={props.type ?? 'button'}
    className={classes('grit-button', className)}
    style={{ '--grit-color': color, '--grit-font-size': `${fontSize}px`, ...style } as Variables}
    onPointerDown={event => {
      onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0 || props.disabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      start(`${event.clientX - rect.left}px`, `${event.clientY - rect.top}px`);
    }}
    onPointerUp={event => { onPointerUp?.(event); setPressed(false); }}
    onPointerCancel={event => { onPointerCancel?.(event); setPressed(false); }}
    onPointerLeave={event => { onPointerLeave?.(event); setPressed(false); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (!event.defaultPrevented && !event.repeat && (event.key === ' ' || event.key === 'Enter')) start('50%', '50%');
    }}
    onKeyUp={event => { onKeyUp?.(event); setPressed(false); }}
    onBlur={event => { onBlur?.(event); setPressed(false); }}>
    <span className="grit-button__highlight" data-pressed={pressed} aria-hidden="true">
      {ripple.key > 0 && <span key={ripple.key} className="grit-button__ripple"
        style={{ '--grit-touch-x': ripple.x, '--grit-touch-y': ripple.y } as Variables} />}
    </span>
    <span className="grit-button__label">{children}</span>
  </button>;
}

export interface CircleSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'role' | 'aria-checked' | 'defaultChecked'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  color?: string;
  /** Outer diameter in pixels, matching Codea's ellipse size. */
  size?: number;
}

export function CircleSwitch({ checked, defaultChecked = false, onCheckedChange, color = orange,
  size = 45, className, style, onClick, onPointerDown, onPointerCancel, onPointerLeave, onKeyDown, onBlur, ...props }: CircleSwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const active = checked ?? internal;
  const [preview, setPreview] = useState<boolean | null>(null);
  const visual = preview ?? active;
  const [animated, setAnimated] = useState(false);
  const previous = useRef(active);
  useEffect(() => {
    if (previous.current !== active) setAnimated(true);
    previous.current = active;
  }, [active]);
  return <button {...props} type="button" role="switch" aria-checked={active}
    className={classes('grit-switch', className)} data-checked={visual} data-animated={animated}
    style={{ '--grit-color': color, '--grit-size': `${Math.max(1, size)}px`, ...style } as Variables}
    onPointerDown={event => {
      onPointerDown?.(event);
      if (!event.defaultPrevented && event.button === 0 && !props.disabled) { setAnimated(true); setPreview(!active); }
    }}
    onPointerCancel={event => { onPointerCancel?.(event); setPreview(null); }}
    onPointerLeave={event => { onPointerLeave?.(event); setPreview(null); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (!event.defaultPrevented && !event.repeat && (event.key === ' ' || event.key === 'Enter')) { setAnimated(true); setPreview(!active); }
    }}
    onBlur={event => { onBlur?.(event); setPreview(null); }}
    onClick={event => {
      onClick?.(event);
      setPreview(null);
      if (event.defaultPrevented) return;
      if (checked === undefined) setInternal(!active);
      setAnimated(true);
      onCheckedChange?.(!active);
    }}>
    <span className="grit-switch__ring" aria-hidden="true"><span className="grit-switch__dot" /></span>
  </button>;
}

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'size'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  color?: string;
  /** Track length, excluding the thumb's radius at each end. */
  length?: number;
  radius?: number;
}

export function Slider({ value, defaultValue, min = 0, max = 1, step = 'any', onValueChange,
  color = orange, length = 300, radius = 15, className, style,
  onPointerDown, onPointerUp, onPointerCancel, onLostPointerCapture, onBlur, ...props }: SliderProps) {
  const upper = Math.max(min, max);
  const [internal, setInternal] = useState(defaultValue ?? min);
  const current = clamp(value ?? internal, min, upper);
  const percent = upper === min ? 0 : (current - min) / (upper - min) * 100;
  const [phase, setPhase] = useState('idle');
  const safeRadius = Math.max(1, radius);
  const release = () => setPhase(previous => previous === 'active' ? 'release' : previous);
  return <span className={classes('grit-slider', className)} data-phase={phase} data-disabled={!!props.disabled}
    style={{ '--grit-color': color, '--grit-length': `${Math.max(1, length)}px`,
      '--grit-radius': `${safeRadius}px`, '--grit-value': `${percent}%`, '--grit-progress': percent / 100, ...style } as Variables}>
    <span className="grit-slider__track" aria-hidden="true"><span className="grit-slider__fill" /></span>
    <span className="grit-slider__thumb" aria-hidden="true" />
    <input {...props} className="grit-slider__input" type="range" min={min} max={upper} step={step} value={current}
      onChange={event => {
        const next = Number(event.currentTarget.value);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }}
      onPointerDown={event => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0 || props.disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setPhase('active');
      }}
      onPointerUp={event => { onPointerUp?.(event); release(); }}
      onPointerCancel={event => { onPointerCancel?.(event); release(); }}
      onLostPointerCapture={event => { onLostPointerCapture?.(event); release(); }}
      onBlur={event => { onBlur?.(event); release(); }} />
  </span>;
}

export interface TopAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children?: ReactNode;
  color?: string;
  textColor?: string;
  /** Milliseconds from opening until dismissal starts; 0 disables the timer. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function TopAlert({ open, onOpenChange, title, children, color = orange, textColor,
  duration = 3000, className, style }: TopAlertProps) {
  const present = usePresence(open, 400);
  const change = useLatest(onOpenChange);
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(() => change.current(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, change]);
  if (!present || typeof document === 'undefined') return null;
  const foreground = textColor ?? (/^(#fff(?:fff)?|white|rgb\(255,\s*255,\s*255\))$/i.test(color) ? '#000' : '#fff');
  return createPortal(<div role="status" aria-live="polite" aria-atomic="true"
    className={classes('grit-top-alert', className)} data-open={open}
    style={{ '--grit-color': color, color: foreground, ...style } as Variables}>
    <strong>{title}</strong>
    {children && <div className="grit-top-alert__body">{children}</div>}
  </div>, document.body);
}

export interface PopAlertAction {
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface PopAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children?: ReactNode;
  color?: string;
  actions?: readonly PopAlertAction[];
  className?: string;
  style?: CSSProperties;
}

/** Native modal focus management, with Codea's 300 + 200 ms entrance. */
export function PopAlert({ open, onOpenChange, title, children, color = orange,
  actions, className, style }: PopAlertProps) {
  const present = usePresence(open, 500);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const change = useLatest(onOpenChange);
  useEffect(() => {
    const node = dialog.current;
    if (!present || !node) return;
    const previousFocus = document.activeElement;
    node.showModal();
    const requestClose = (event: Event) => { event.preventDefault(); change.current(false); };
    node.addEventListener('cancel', requestClose);
    return () => {
      node.removeEventListener('cancel', requestClose);
      node.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [present, change]);
  if (!present || typeof document === 'undefined') return null;
  const buttons = actions ?? [{ label: 'Cancel' }, { label: 'OK' }];
  return createPortal(<dialog ref={dialog} aria-labelledby={titleId} aria-describedby={children ? bodyId : undefined}
    tabIndex={-1}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]'
      )).filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && node.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); event.currentTarget.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
        event.preventDefault(); first.focus();
      }
    }}
    className={classes('grit-pop-alert', className)} data-open={open}
    style={{ '--grit-color': color, ...style } as Variables}>
    <h2 id={titleId}>{title}</h2>
    {children && <div id={bodyId} className="grit-pop-alert__body">{children}</div>}
    <div className="grit-pop-alert__actions">
      {buttons.map((action, index) => <SmoothButton key={index} color={color} fontSize={15}
        disabled={!open || action.disabled} onClick={() => { action.onClick?.(); onOpenChange(false); }}>
        {action.label}
      </SmoothButton>)}
    </div>
  </dialog>, document.body);
}
