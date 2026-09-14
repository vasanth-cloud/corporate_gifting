import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'giftpulse_super_secret_enterprise_jwt_key_2026'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE' | 'VENDOR_USER';
  companyId?: string;
  vendorId?: string;
}

export async function signJWT(payload: JWTPayload, expiresIn = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
