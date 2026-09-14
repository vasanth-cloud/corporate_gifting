import crypto from 'crypto';

export interface TokenValidationResult {
  valid: boolean;
  reason?: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED';
  tokenData?: {
    token: string;
    campaignId: string;
    recipientId: string;
    recipientName: string;
    companyName: string;
    budget: number;
    expiresAt: Date;
    isUsed: boolean;
  };
}

// Cryptographic 256-bit Magic Token Generator
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createTokenPayload(
  campaignId: string,
  recipientId: string,
  recipientName: string,
  companyName: string,
  budget: number,
  expiresInDays = 14
) {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 86400000);

  return {
    token,
    campaignId,
    recipientId,
    recipientName,
    companyName,
    budget,
    isUsed: false,
    expiresAt,
    claimUrl: `/claim/${token}`,
  };
}

export function validateToken(
  tokenObj: { token: string; isUsed: boolean; expiresAt: Date } | null
): TokenValidationResult {
  if (!tokenObj) {
    return { valid: false, reason: 'NOT_FOUND' };
  }

  if (tokenObj.isUsed) {
    return { valid: false, reason: 'ALREADY_USED' };
  }

  if (new Date() > new Date(tokenObj.expiresAt)) {
    return { valid: false, reason: 'EXPIRED' };
  }

  return { valid: true };
}
