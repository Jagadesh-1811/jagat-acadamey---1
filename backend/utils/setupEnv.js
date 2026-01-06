import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

const firebaseConfig = {
    FIREBASE_PROJECT_ID: "jagatacademy-36462",
    FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-fbsvc@jagatacademy-36462.iam.gserviceaccount.com",
    FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwCy5nuY12sqSq\\n2zrb8wmWWEfz/Bd3bgjk7n9R8c8WDXgCItFiGeh4xrx45xFOOsgj2/2sun/YsDNj\\ndEwotLP+ehFlxE6PDByFCojCBJaMtUodeAAXZgaRgB0w24qLsDHQr0AxXvx+mvVz\\n6AI3C4SrTVfech+Xul+i+zbBTnxf35CvOpefrGkuA4VNaFo85x3ap1jSmHMKKm8m\\npLlEoGwCecl6ikgoaQCG9zWRzov8WfNEabZ32uM8siSYI/DyUPc6arbuHb4ok9qp\\n6HlQNPr8KjD2VtCqOsprei4PZJtGh85bOX/vHzCY1aoaGEOpdUnuozSlZMZmaMs8\\n9fIo/ktdAgMBAAECggEAP1wu3gczCpMeYB4ab5poC3QHpaFIQuRYEClkqrYYvgun\\n80Db0m6XtIx2vh8QI/NVIE7n3Nic9fzo6fUsCgSLud3uUA3Y5nRJ+XpCoW3sT4Va\\nQQP1KHbAi3KsTu7dTQxjyYOh24Mf5mNYT1ikH3KmU884/mddxoq+LBc1bFqWuhxO\\nwCmgnEDAhmLZYnhR6LxXkWzZYDM1720mU+W/1OtCTWL8/NMfgGlR0t0JFd4LkI4E\\nK6cxqEUMjav8Vy/i9YEZSY3QbjpzwzBPPkxB7GeBt00iwU3sOseXMiTFoI0LDPfx\\ndt5WPCHAbO8PvpT/M+caKaXytZPDMVhWrPjqPZwUwwKBgQD3tw0oFGAQsjUDC8e+\nrQRR04wQC9/gGSIwkNJf/pBmgMj9yMtkzR5pknFIE9MBK5L188dJdwaBKQBRFUtB\\n/ooPQzRenRScg5fuMRIEwMiI8HEbNwM/sdPErUMLVi6PqwuT41GSx1T4sEPhLab0\\n5Lcs3+SYjL9JD+sX84GOmjJpJwKBgQC17nnd0GLD7cnVZNU8ddG4ulT3PxZoyqeD\\nNEGFY+AXYrvutA/GBR/Qi7RUxbRfgpnMu/PTr5HGAseMfGGAtTq057UWwd3rY0Ri\\nyX5JcbKLh/0GgTNkP1tyoBIpR96GI9LEZJmrEK7/eEQcqPMHDTePZ31y2pPHmCWr\\ndVl1tD9R2wKBgDX1xgPpDFQWvb2AH27FuZ8peeU08Pub/fqeUXVfuozZmO7Pgp7e\\nn7VXlR2iU+B5YXX6OHskVmJkUBFZlh82F1TjytChXxAJClt0jPxEEmriFYFcJnUF\\ng5/gLi6WA2aAV/FLH0Xd7gCORPsUOr415ED+NImWf0SnFwsMnDg4FqsZAoGAILce\\nkQWtDQCQn9/+/F1PdkGDj+Z3WCbBErXt5le8b1gg5V7Zy0kWnIDSz7+xnM82avuN\\ncA6NTycmzRt8yRFN2kQka1A3YOG75WvIWtqoObEdjfLj0+4UursQKP40hLiiaRCS\\nFZHtdiEhVmoHMchtqkr44xNtKaIxe/ChQqpEDKsCgYBMExHkEgQqnRC9KmDVBWen\\nrIwC2Ur7OP2pGC3AvAPAkGQSUmpMB31OpgghYtohFO347sATRCuhfGQzhQQtQsBR\\nxu6sOY14m2kUwkS24bm3Cp7+AHCP3qghKWfHjUCSygIBrdHtsU3RkjzlHHHUwbH+\\nuLHTbjqae9EarUGTKMwJWg==\\n-----END PRIVATE KEY-----\\n"
};

try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    let newContent = envContent;
    let addedCount = 0;

    // Add or replace each config
    for (const [key, value] of Object.entries(firebaseConfig)) {
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (regex.test(newContent)) {
            // Replace existing
            newContent = newContent.replace(regex, `${key}="${value}"`);
        } else {
            // Append
            if (!newContent.endsWith('\n') && newContent.length > 0) newContent += '\n';
            newContent += `${key}="${value}"\n`;
            addedCount++;
        }
    }

    fs.writeFileSync(envPath, newContent);
    console.log(`✅ Successfully updated .env file!`);
    console.log(`   Updated keys: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY`);

} catch (error) {
    console.error('❌ Error updating .env file:', error);
}
