import admin from 'firebase-admin'
import serviceAccount from './service-account.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://luna-4e044-default-rtdb.firebaseio.com"
});

export const database = admin.database();

export async function getData(path) {
    try {
        const snapshot = await database.ref(path).once('value');
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