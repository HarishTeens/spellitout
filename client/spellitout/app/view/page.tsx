"use client";

import React, { useEffect, useRef } from "react";
import connectSocket from "@/lib/socket";

export const ViewPage = () => {
  const sock = useRef<any>(null);

  useEffect(() => {
    sock.current = connectSocket();
    if (!sock.current) return;
    sock.current.on("transcript", (transcript: any) => {
      // captions.innerHTML = transcript ? `<span>${transcript}</span>` : "";
      console.log(transcript);
    });
  }, []);
  return <div>ViewPage</div>;
};
export default ViewPage;
