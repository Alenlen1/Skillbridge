import { Response } from "express";

// Simple in-memory broker: maps a username to the list of open SSE
// connections (browser tabs) currently watching that portfolio.
// Note: this only works within a single server instance/process — if
// you ever scale to multiple backend instances, this would need to move
// to something shared like Redis pub/sub instead.
const connections = new Map<string, Response[]>();

export function addConnection(username: string, res: Response) {
  const existing = connections.get(username) || [];
  existing.push(res);
  connections.set(username, existing);
}

export function removeConnection(username: string, res: Response) {
  const existing = connections.get(username);
  if (!existing) return;
  connections.set(
    username,
    existing.filter((r) => r !== res),
  );
}

// Call this whenever something changes that visitors of this portfolio
// should see live (e.g. an endorsement gets approved).
export function broadcastUpdate(username: string) {
  const existing = connections.get(username);
  if (!existing || existing.length === 0) return;
  for (const res of existing) {
    res.write(`data: ${JSON.stringify({ type: "update" })}\n\n`);
  }
}
