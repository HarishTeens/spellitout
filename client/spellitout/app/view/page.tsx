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
  const outLangRef = useRef<string>("");

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
        outLangRef.current = outLang;

        setLoading(false);
        console.log('start meeting')
        startMeeting();
      })
      .catch((err) => {
        router.push("/");
        return;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const langText = transcript[outLangRef.current];
      if(langText.length === 0) return;
      if(displayedTextRef.current[0] === langText) return;
      const newTexts = [langText, ...displayedTextRef.current];
      setDisplayedText(newTexts)   
      displayedTextRef.current = newTexts;
      console.log("newtexts", newTexts)
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
        <div style={{ maxHeight: "300px", width: "75%", overflow: "scroll", display: "flex" , flexDirection: "column-reverse" }}>
          {displayedText.map((t) => {
            return <p key={t + Date.now()} style={{ fontSize: "4em" }}>{t}</p>;
          })}
        </div>
      </div>
    </div>
  );
};
export default ViewPage;
