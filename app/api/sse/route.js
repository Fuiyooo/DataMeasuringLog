import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Store clients by resource type using Map
const resourceClients = new Map();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');

    if (!resource) {
        return new NextResponse(
            JSON.stringify({ error: "Missing resource parameter" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    // Create new client handler
    const client = {
        write: (data) => writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)),
        close: () => writer.close()
    };

    // Initialize resource if not exists
    if (!resourceClients.has(resource)) {
        resourceClients.set(resource, new Set());
    }

    const clients = resourceClients.get(resource);
    clients.add(client);

    // Handle client disconnect
    request.signal.onabort = () => {
        clients.delete(client);
        if (clients.size === 0) {
            resourceClients.delete(resource);
        }
        client.close();
    };

    return new NextResponse(responseStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

// Broadcast function to notify specific resources
export function broadcast(resource, message) {
    const clients = resourceClients.get(resource);
    if (clients) {
        clients.forEach(client => {
            try {
                client.write(message);
            } catch (error) {
                console.error(`Error broadcasting to ${resource}:`, error);
                clients.delete(client);
            }
        });
    }
}