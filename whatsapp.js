export async function sendWpp(phone, title, description) {
    await fetch(
        'https://lunapp.vercel.app/api/whatsapp-reminder',
        {
            method: 'POST',
            body: JSON.stringify({ phone, title, description }),
            headers: { 'Content-Type': 'application/json' }
        })
}
