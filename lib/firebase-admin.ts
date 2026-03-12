import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export async function setUserRole(uid: string, role: 'admin' | 'client') {
  await adminAuth.setCustomUserClaims(uid, { role });
}

export async function getUserRole(uid: string) {
  const user = await adminAuth.getUser(uid);
  return user.customClaims?.role as string | undefined;
}

export { adminDb, adminAuth };
