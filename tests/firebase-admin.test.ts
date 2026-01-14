import { describe, it, expect, vi } from 'vitest';
import * as admin from 'firebase-admin';

// Mock firebase-admin
vi.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: vi.fn(),
  credential: {
    cert: vi.fn(),
  },
  firestore: vi.fn(() => ({})),
  auth: vi.fn(() => ({})),
}));

it('should initialize firebase-admin with correct config', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';

    const { adminDb, adminAuth } = await import('@/lib/firebase-admin');
    
    expect(admin.initializeApp).toHaveBeenCalled();
    expect(adminDb).toBeDefined();
    expect(adminAuth).toBeDefined();
});
