"use client";
import { NextRequest, NextResponse, userAgent } from "next/server";

//
export default function IsMobile() {
  const request = new NextRequest("http://localhost:3000");
  const url = request.nextUrl;
  const { device } = userAgent(request);
  const viewport = device.type || "desktop";
  url.searchParams.set("viewport", viewport);
  console.log(`Viewport: ${viewport}`);
}
