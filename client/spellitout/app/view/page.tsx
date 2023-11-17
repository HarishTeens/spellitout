"use client";

import React, { useEffect, useRef, useState } from "react";
import connectSocket from "@/lib/socket";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TransText {
  key: string;
  speaker: string;
  text: string;
}

const ViewPage = () => {
  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedText, setDisplayedText] = useState<TransText[]>([]);

  const displayedTextRef = useRef<TransText[]>([]);
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
        console.log("start meeting");
        startMeeting();
      })
      .catch((err) => {
        router.push("/");
        return;
      });

    // return () => {
    //   stopMeeting();
    // };

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

    // router.push("/");
  };

  const startMeeting = () => {
    sock.current = connectSocket(microphoneRef);
    if (!sock.current) {
      // router.push("/");

      return;
    }
    sock.current.on("transcript", (transcript: any) => {
      // captions.innerHTML = transcript ? `<span>${transcript}</span>` : "";
      console.log(transcript);
      let langText = transcript[outLangRef.current]?.trim();
      if (!langText && langText?.length === 0) return;
      const transText: TransText = {
        key: Date.now() + transcript.speaker,
        speaker: transcript.speaker,
        text: langText,
      };
      if (displayedTextRef.current[0]?.text === langText) return;
      const newTexts = [transText, ...displayedTextRef.current];
      setDisplayedText(newTexts);
      displayedTextRef.current = newTexts;
      console.log("newtexts", newTexts);
    });
  };
  if (loading) {
    return <></>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-black">
      {/* <div className="flex items-center gap-4 flex-col">
        <div
          style={{
            maxHeight: "400px",
            width: "75%",
            overflow: "scroll",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          {displayedText.map((t) => {
            return (
              <p key={t.key} style={{ fontSize: "1.8em" }}>
                {t.speaker} {t?.text}
              </p>
            );
          })}
        </div>
      </div>
      <Button variant={"destructive"} onClick={stopMeeting}>
        Stop
      </Button> */}
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Speak & Transcribe</h1>
        <div className="w-[50rem] max-w-4xl bg-slate-600 rounded-lg shadow-lg p-6 space-y-4 border-6 border-red-300">
          <Label htmlFor="transcription" className="text-white">
            Transcription
          </Label>
          <div className="h-[400px] w-full overflow-scroll flex flex-col-reverse scrollbar-hide focus:outline-none">
            {displayedText.map((t) => {
              return (
                <p key={t.key} className="w-[80%] text-lg text-white">
                  {t.speaker} {t?.text}
                </p>
              );
            })}
          </div>

          <Button
            className="w-full py-2 text-lg font-bold"
            variant="destructive"
            onClick={stopMeeting}
          >
            Stop
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ViewPage;
