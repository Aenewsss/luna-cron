export async function sendWpp(phone, title, description) {
    await fetch(
        'http://localhost:3000/api/whatsapp-reminder',
        {
            method: 'POST',
            body: JSON.stringify({ phone, title, description }),
            headers: { 'Content-Type': 'application/json' }
        })
}