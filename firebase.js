import admin from 'firebase-admin'
import { serviceAccount } from "./service-account.js"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://luna-4e044-default-rtdb.firebaseio.com"
});

const db = admin.database();

export async function getData(path) {
    try {
        const snapshot = await db.ref(path).once('value');
        if (snapshot.exists()) {
            console.log('Data:', Object.values(snapshot.val()));
            return Object.values(snapshot.val());
        } else {
            console.log('No data found at path:', path);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}