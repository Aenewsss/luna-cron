export async function sendWpp(phone, title, description) {
    try {
        await fetch(
            'https://lunapp.vercel.app/api/whatsapp-reminder',
            {
                method: 'POST',
                body: JSON.stringify({ phone, title, description }),
                headers: { 'Content-Type': 'application/json' }
            })
    } catch (error) {
        console.error(error)
    }
}
