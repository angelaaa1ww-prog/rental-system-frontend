import React, { cloneElement, isValidElement, useId } from 'react';
import {
  AlertTriangle, ArrowUpRight, Bell, Building2, Check, CheckCircle2, CircleDollarSign,
  CircleX, CreditCard, Edit, FileText, House, Info, KeyRound, LockKeyhole, LogOut,
  Menu, MessageSquare, Moon, Pencil, Phone, Plus, ReceiptText, RefreshCw, Search,
  Send, ShieldCheck, SlidersHorizontal, Sun, Trash2, UserRound, UsersRound, X
} from 'lucide-react';
import { BrandMark } from './BrandLogo';

const ICONS = {
  alertTriangle: AlertTriangle,
  arrowUpRight: ArrowUpRight,
  barChart: CircleDollarSign,
  bell: Bell,
  building: Building2,
  check: Check,
  checkCircle: CheckCircle2,
  creditCard: CreditCard,
  dollarSign: CircleDollarSign,
  edit: Pencil,
  fileText: FileText,
  filter: SlidersHorizontal,
  home: House,
  info: Info,
  key: KeyRound,
  lock: LockKeyhole,
  logOut: LogOut,
  menu: Menu,
  messageSquare: MessageSquare,
  moon: Moon,
  pencil: Pencil,
  phone: Phone,
  plus: Plus,
  receipt: ReceiptText,
  refresh: RefreshCw,
  search: Search,
  send: Send,
  shield: ShieldCheck,
  sun: Sun,
  trash: Trash2,
  user: UserRound,
  users: UsersRound,
  x: X,
  xCircle: CircleX
};

export function Icon({ name, size = 18, label, className = '' }) {
  const LucideIcon = ICONS[name] || Info;
  return <LucideIcon size={size} className={className} strokeWidth={1.9} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" />;
}

export function Avatar({ name, size = 'md' }) {
  const initials = String(name || '?').split(' ').map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
}

export function Field({ label, children, hint, required = false }) {
  const generatedId = useId();
  const controlId = children?.props?.id || generatedId;
  const control = isValidElement(children) ? cloneElement(children, { id: controlId, 'aria-required': required || undefined }) : children;
  return <div className="field"><label htmlFor={controlId}>{label}{required && <span aria-hidden="true"> *</span>}</label>{control}{hint && <small className="field-hint">{hint}</small>}</div>;
}

export function MiniStat({ label, value, color }) {
  return <div><p className="eyebrow" style={{ color: 'var(--muted)' }}>{label}</p><p style={{ fontSize: '1rem', fontWeight: 700, color: color || 'var(--ink)' }}>{value}</p></div>;
}

export function StatusPill({ status }) {
  const isOccupied = status === 'occupied';
  return <span className={`tag ${isOccupied ? 'tag-danger' : 'tag-success'}`}><Icon name={isOccupied ? 'lock' : 'key'} size={12} />{isOccupied ? 'Occupied' : 'Vacant'}</span>;
}

export function EmptyState({ icon, title, sub }) {
  return <div className="empty-state"><BrandMark className="empty-state-brand" alt="" /><div className="empty-icon"><Icon name={icon || 'info'} size={24} /></div><strong>{title}</strong><p>{sub}</p></div>;
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><h2 id="confirm-modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onCancel}><Icon name="x" size={16} /></button></div><p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{message}</p><div className="button-row"><button className="btn-outline" onClick={onCancel}>Cancel</button><button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{danger ? 'Delete' : 'Confirm'}</button></div></div></div>;
}

export const cardStyle = {};
export const cardTitleStyle = {};
export const tableStyle = {};
export const thStyle = {};
export const tdStyle = {};