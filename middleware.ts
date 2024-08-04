import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
    requestHeaders.set("x-geo-country", request.geo?.country!);
    requestHeaders.set("x-geo-city", request.geo?.city!);
    requestHeaders.set("x-geo-region", request.geo?.region!);
    requestHeaders.set("x-ip", request.ip!);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}