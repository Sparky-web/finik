import { renderTrpcPanel } from '@extendslcc/trpc-panel';
import { NextResponse } from 'next/server';
import { appRouter } from '~/server/api/root';

export async function GET() {
  return new NextResponse( renderTrpcPanel(appRouter, {
    url: "http://localhost:3000/api/trpc",
    transformer: "superjson",
  }), {
    headers: { 'Content-Type': 'text/html' },
  });
}