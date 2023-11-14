"use client";

import React, { useEffect, useRef, useState } from "react";
import connectSocket from "@/lib/socket";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export const ViewPage = () => {
  const sock = useRef<any>(null);
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const [inpLanguage, setInpLanguage] = useState<string>("");
  const [outLanguage, setOutLanguage] = useState<string>("");

  const stopMeeting = async () => {
    if (!microphoneRef.current) return;
    console.log(microphoneRef.current);
    microphoneRef.current?.stop();
    if (sock.current) {
      sock.current.close();
    }

    await api.stopMeeting();
  };

  const startMeeting = () => {
    sock.current = connectSocket(microphoneRef);
    if (!sock.current) return;
    sock.current.on("transcript", (transcript: any) => {
      // captions.innerHTML = transcript ? `<span>${transcript}</span>` : "";
      console.log(transcript);
      const contents = Object.values(transcript).filter(Boolean);

      console.log(contents);

      if (!contents.length) return;
      setInpLanguage((lang) => {
        if (lang.includes(contents[0] as string)) return lang;
        return lang + " " + contents[0];
      });
      setOutLanguage((lang) => {
        if (lang.includes(contents[1] as string)) return lang;
        return lang + " " + contents[1];
      });
    });
  };
  return (
    <>
      <div>ViewPage</div>
      <Button onClick={startMeeting}>Start</Button>
      <Button variant={"destructive"} onClick={stopMeeting}>
        Stop
      </Button>
      <div className="flex items-center gap-4 flex-col">
        <div className="text-lg max-w-xl">{inpLanguage}</div>
        <div className="text-lg max-w-xl">{outLanguage}</div>
      </div>
    </>
  );
};
export default ViewPage;
