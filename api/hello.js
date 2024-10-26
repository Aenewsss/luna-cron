import admin from 'firebase-admin';
import { serviceAccount } from "../service-account.js"

if (!admin.apps.length) {
  try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://luna-4e044-default-rtdb.firebaseio.com"
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export default async function handler(req, res) {
  try {
    // Test with a simple hello world response
    res.status(200).json({ message: 'Hello, World! Firebase Admin is working.' });
  } catch (error) {
    console.error('Error in Hello World route:', error);
    res.status(500).json({ error: 'Failed to respond properly' });
  }
}