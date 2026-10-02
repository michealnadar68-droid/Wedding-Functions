/**
 * Elysian Wedlock Privacy & Data Masking Engine
 * Enforces strict role-based data isolation and sensitive attribute masking.
 */

import { AuthRoleType } from '../types';

/**
 * Mask an email address for public or unauthorized views (e.g., pr***@domain.com)
 */
export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return '•••••••@private.in';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

/**
 * Mask a phone number for public or unauthorized views (e.g., +91 98*** **456)
 */
export function maskPhone(phone?: string): string {
  if (!phone) return '+91 ••••• •••••';
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  if (digitsOnly.length < 8) return '+91 ••••• •••••';
  const prefix = phone.slice(0, 6);
  const suffix = phone.slice(-3);
  return `${prefix}*** **${suffix}`;
}

/**
 * Checks whether the current user is permitted to view unmasked private data for a record.
 * Super Admin or the actual owner of the record is authorized.
 */
export function canViewSensitiveUserData(
  currentUserRole: AuthRoleType,
  currentUserId: string,
  recordOwnerUserId?: string
): boolean {
  if (currentUserRole === 'admin') return true;
  if (!recordOwnerUserId) return false;
  return currentUserId === recordOwnerUserId;
}
