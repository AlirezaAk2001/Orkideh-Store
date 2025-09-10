// // export-firestore.js
// require('dotenv').config({ path: 'C:/Users/AM/Desktop/Orkideh Sewing Machine/sewing-store/.env.local' }); // بارگذاری فایل .env.local
// const admin = require('firebase-admin');
// const fs = require('fs/promises');

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// async function exportProducts() {
//   try {
//     const productsRef = db.collection('products');
//     const snapshot = await productsRef.get();
//     const products = [];

//     snapshot.forEach(doc => {
//       products.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     await fs.writeFile('products.json', JSON.stringify(products, null, 2));
//     console.log('Products exported successfully to products.json');
//   } catch (error) {
//     console.error('Error exporting products:', error);
//   }
// }

// exportProducts();