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
      let langText = transcript[outLangRef.current].trim();
      if(langText.length === 0) return;
      if(displayedTextRef.current[0] === langText) return;
      langText = transcript.speaker + langText;
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
      
      <div className="flex items-center gap-4 flex-col">
        <div style={{ maxHeight: "400px", width: "75%", overflow: "scroll", display: "flex" , flexDirection: "column-reverse" }}>
          {displayedText.map((t) => {
            return <p key={t + Date.now()} style={{ fontSize: "4em" }}>{t}</p>;
          })}
        </div>
      </div>
      <Button variant={"destructive"} onClick={stopMeeting}>
        Stop
      </Button>
    </div>
  );
};
export default ViewPage;
