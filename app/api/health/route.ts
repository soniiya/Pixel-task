import { NextResponse } from 'next/server';
export function GET(){ return NextResponse.json({ ok: true, env: process.env.NODE_ENV }); }
