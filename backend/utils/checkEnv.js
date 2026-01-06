import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🔍 Checking Firebase Environment Variables...');
console.log('----------------------------------------');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log(`FIREBASE_PROJECT_ID:   ${projectId ? '✅ Present' : '❌ MISSING'}`);
if (projectId) console.log(`   Value: ${projectId}`);

console.log(`FIREBASE_CLIENT_EMAIL: ${clientEmail ? '✅ Present' : '❌ MISSING'}`);
if (clientEmail) console.log(`   Value: ${clientEmail}`);

console.log(`FIREBASE_PRIVATE_KEY:  ${privateKey ? '✅ Present' : '❌ MISSING'}`);
if (privateKey) {
    console.log(`   Length: ${privateKey.length} chars`);
    console.log(`   Starts with: ${privateKey.substring(0, 20)}...`);
    // Check for common formatting issues
    if (privateKey.includes('\\n')) console.log('   ⚠️ Contains literal \\n characters (may need fixing)');
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) console.log('   ⚠️ Wrapped in quotes (may need removal)');
}

console.log('----------------------------------------');
if (projectId && clientEmail && privateKey) {
    console.log('✅ All variables are present!');
} else {
    console.log('❌ Some variables are missing. Please add them to backend/.env');
}
console.log('\n');
