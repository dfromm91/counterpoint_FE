// server/services/roomService.js
export const rooms = new Map(); // roomId -> { players: [], notes: [], currentTurn: string }

export function ensureRoom(roomId) {
  if (!rooms.has(roomId))
    rooms.set(roomId, { players: [], notes: [], currentTurn: null });
  return rooms.get(roomId);
}

export function nextTurn(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.players.length) return null;
  const idx = room.players.findIndex((p) => p.id === room.currentTurn);
  const next = room.players[(idx + 1) % room.players.length];
  room.currentTurn = next.id;
  return next.id;
}
