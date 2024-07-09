import { NextRequest } from 'next/server'

type Params = {
    id: string
}

export async function POST(request: NextRequest, context: { params: Params }) {
    const data = await request.json()
    console.log('REQUEST', data.data.sync_product.id)
    if (data.type === 'product_updated') {
        const syncResponse = await fetch(`https://api.printful.com/store/products/${data.data.sync_product.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer 7mFSBeY8lylaUlibKaR2wMDvlWocLuLzTFhEho0I`,
            },
        })
        console.log(syncResponse)
        const syncJson = await syncResponse.json();
        // console.log(syncJson.result.sync_variants[0])
        // console.log(syncJson.result.sync_variants[1])
        console.log(syncJson)
    }

    return new Response('Success!', {
        status: 200,
    })
}