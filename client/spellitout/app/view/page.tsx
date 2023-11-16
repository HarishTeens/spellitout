"use client";

import React, { useEffect, useRef, useState } from "react";
import connectSocket from "@/lib/socket";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";

const ViewPage = () => {
  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedText, setDisplayedText] = useState<string[]>([]);

  const displayedTextRef = useRef<string[]>([]);

  const outLang = localStorage.getItem("outputLang") ||  "en";
  const sock = useRef<any>(null);
  const microphoneRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    axios
      .get(`${base_url}/status`)
      .then((resp) => {
        const { isMeetingRunning } = resp.data;
        if (!isMeetingRunning) {
          router.push("/");
          return;
        }

        const inpLang = localStorage.getItem("inputLang");
        const outLang = localStorage.getItem("outputLang");

        if (!inpLang || !outLang) {
          router.push("/");
          return;
        }

        setLoading(false);

        startMeeting();
      })
      .catch((err) => {
        router.push("/");
        return;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=> {
    displayedTextRef.current = displayedText;
  },[displayedText])

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
    if (!sock.current) {
      router.push("/");

      return;
    }
    sock.current.on("transcript", (transcript: any) => {
      // captions.innerHTML = transcript ? `<span>${transcript}</span>` : "";
      console.log(transcript);
      if(transcript === '' ) return;
      const langText = transcript[outLang];
      const newTexts = [...displayedTextRef.current];
      if(newTexts.at(-1) === langText) return;
      newTexts.push(langText);
      setDisplayedText(newTexts)      
    });
  };
  if (loading) {
    return <></>;
  }
  return (
    <div className="h-screen bg-white">
      ViewPage
      {/* <Button onClick={startMeeting}>Start</Button> */}
      <Button variant={"destructive"} onClick={stopMeeting}>
        Stop
      </Button>
      <div className="flex items-center gap-4 flex-col">
        <div style={{ maxHeight: "300px", overflow: "scroll" }}>
          {displayedText.map((t) => {
            return <p key={t + Date.now()} style={{ fontSize: "2em" }}>{t}</p>;
          })}
        </div>
      </div>
    </div>
  );
};
export default ViewPage;
