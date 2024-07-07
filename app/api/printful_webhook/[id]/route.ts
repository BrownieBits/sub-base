import { NextRequest } from 'next/server'

type Params = {
    id: string
}

export async function POST(request: NextRequest, context: { params: Params }) {
    console.log('STORE ID', context.params.id)
    console.log('REQUEST', request)
    return new Response('Success!', {
        status: 200,
    })
}