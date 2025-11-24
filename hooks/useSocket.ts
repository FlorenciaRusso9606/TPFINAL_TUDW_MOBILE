import { useEffect, useRef } from "react";
import socket from "../services/socket";

export default function useSocket(onMessage: (msg: any) => void) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  });

  useEffect(() => {
    const handleIncoming = (msg: any) => {
      // Aseguramos ID válido sin romper nada
      const validMsg = {
        ...msg,
        id:
          typeof msg.id === "string"
            ? msg.id
            : typeof msg.id === "number"
            ? msg.id.toString()
            : `sock-${Date.now()}-${Math.random()}`,
      };

      handlerRef.current(validMsg);
    };

    socket.on("message", handleIncoming);

    return () => {
      socket.off("message", handleIncoming);
    };
  }, []);

  const send = (payload: any) => {
    socket.emit("sendMessage", payload);
  };

  return { send };
}
