"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
} from "@/services/realtime-socket";
import { authStore } from "@/store/auth-store";

export function useRealtimeSocket(): Socket | null {
  const token = authStore((state) => state.session?.idToken ?? null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      disconnectRealtimeSocket();
      setSocket(null);
      return;
    }

    setSocket(connectRealtimeSocket(token));
  }, [token]);

  return socket;
}
