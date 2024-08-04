import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
    requestHeaders.set("x-geo", request.geo?.country!);
    requestHeaders.set("x-ip", request.ip!);
    console.log('HEADERS******', request)
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}