// test_firebase_and_images.mjs
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkImage(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
    } catch (e) {
        return false;
    }
}

(async () => {
    console.log('🔄 Connecting to Firestore...');
    try {
        const querySnapshot = await getDocs(collection(db, 'vehicles'));
        const vehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`✅ Retrieved ${vehicles.length} vehicle(s) from Firestore.`);

        if (vehicles.length === 0) {
            console.warn('⚠️ No vehicles found in "vehicles" collection.');
            process.exit(0);
        }

        console.log('🔄 Verifying images...');
        const results = await Promise.all(
            vehicles.map(async (v) => {
                const img = v.fotos && v.fotos.length > 0 ? v.fotos[0] : null;
                if (!img) return { id: v.id, ok: false, reason: 'No image URL found' };

                const ok = await checkImage(img);
                return { id: v.id, ok, reason: ok ? null : 'Image URL unreachable' };
            })
        );

        const failed = results.filter((r) => !r.ok);
        if (failed.length === 0) {
            console.log('✅ All vehicle images are reachable.');
        } else {
            console.warn(`⚠️ ${failed.length} image(s) failed to load:`);
            failed.forEach((f) => console.warn(`   • Vehicle ${f.id}: ${f.reason}`));
        }
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
})();
