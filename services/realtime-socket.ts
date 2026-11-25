"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

let sharedSocket: Socket | null = null;
let activeToken: string | null = null;
let socketReady = false;

export function connectRealtimeSocket(token: string): Socket {
  if (!sharedSocket) {
    sharedSocket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      transports: ["websocket", "polling"],
    });
    sharedSocket.on("connection:ready", () => {
      socketReady = true;
    });
    sharedSocket.on("disconnect", () => {
      socketReady = false;
    });
    sharedSocket.on("connect_error", () => {
      socketReady = false;
    });
  }

  if (activeToken !== token) {
    activeToken = token;
    socketReady = false;
    sharedSocket.auth = { token };
    if (sharedSocket.connected) sharedSocket.disconnect();
    sharedSocket.connect();
  } else if (!sharedSocket.connected && !sharedSocket.active) {
    sharedSocket.connect();
  }

  return sharedSocket;
}

export function isRealtimeSocketReady(socket: Socket): boolean {
  return socketReady && socket.connected;
}

export function disconnectRealtimeSocket(): void {
  socketReady = false;
  activeToken = null;
  sharedSocket?.disconnect();
  sharedSocket = null;
}
