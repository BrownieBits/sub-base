'use server';

export async function connectToPrintful(code: string) {
    const tokenResponse = await fetch('https://www.printful.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_PRINTFUL_SECRET_KEY,
            code: code
        }),
    })
    const json = await tokenResponse;
    console.log('TOKEN RESPONSE', json)
    return
}