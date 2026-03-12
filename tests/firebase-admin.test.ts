import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as admin from 'firebase-admin';

// Mock firebase-admin
const mockSetCustomUserClaims = vi.fn();
const mockGetUser = vi.fn();

vi.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: vi.fn(),
  credential: {
    cert: vi.fn(),
  },
  firestore: vi.fn(() => ({})),
  auth: vi.fn(() => ({
    setCustomUserClaims: mockSetCustomUserClaims,
    getUser: mockGetUser,
  })),
}));

describe('firebase-admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize firebase-admin with correct config', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';

    const { adminDb, adminAuth } = await import('@/lib/firebase-admin');
    
    expect(admin.initializeApp).toHaveBeenCalled();
    expect(adminDb).toBeDefined();
    expect(adminAuth).toBeDefined();
  });

  it('should provide a function to set user roles', async () => {
    const { setUserRole } = await import('@/lib/firebase-admin');
    const uid = 'test-uid';
    const role = 'admin';

    mockSetCustomUserClaims.mockResolvedValue(undefined);

    await setUserRole(uid, role);

    expect(mockSetCustomUserClaims).toHaveBeenCalledWith(uid, { role });
  });

  it('should provide a function to get user roles', async () => {
    const { getUserRole } = await import('@/lib/firebase-admin');
    const uid = 'test-uid';
    const role = 'client';

    mockGetUser.mockResolvedValue({
      customClaims: { role }
    });

    const result = await getUserRole(uid);

    expect(mockGetUser).toHaveBeenCalledWith(uid);
    expect(result).toBe(role);
  });
});
