"use client";

import React, { useEffect, useRef, useState } from "react";
import connectSocket from "@/lib/socket";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  const [readyStatus, setReadyStatus] = useState<"ready" | "not ready">("not ready");
  const tryingConnectionRef = useRef<boolean>(false);

  const displayedTextRef = useRef<TransText[]>([]);
  const prefLangRef = useRef<string>("");

  const sock = useRef<any>(null);
  const microphoneRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if(tryingConnectionRef.current) return;
    tryingConnectionRef.current = true;
    axios
      .get(`${base_url}/status`)
      .then((resp) => {
        const { isMeetingRunning } = resp.data;
        if (!isMeetingRunning) {
          router.push("/");
          return;
        }

        const prefLang = localStorage.getItem("prefLang");

        if (!prefLang) {
          // router.push("/");
          return;
        }
        prefLangRef.current = prefLang;

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

    router.push("/");
  };

  const startMeeting = () => {
    sock.current = connectSocket(microphoneRef, ()=>{
      setReadyStatus("ready");
    });
    if (!sock.current) {
      router.push("/");

      return;
    }
    sock.current.on("transcript", (transcript: any) => {
      // captions.innerHTML = transcript ? `<span>${transcript}</span>` : "";
      console.log(transcript);
      let langText = transcript[prefLangRef.current]?.trim();
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
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Spell It Out</h1>
        <div className="w-[50rem] max-w-4xl  rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-lg p-1 space-y-4 border-6 border-red-300">
          <div className="bg-slate-600 p-6">
            <Label htmlFor="transcription" className="text-white text-xl">
              Transcription
            </Label>
            <div className="h-[400px] w-full overflow-scroll flex flex-col-reverse scrollbar-hide focus:outline-none">
              {displayedText.map((t) => {
                return (
                  <p key={t.key} className="w-full text-xl text-white ">
                    <span className="font-bold bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text ">
                      {t.speaker}
                    </span>
                    {t?.text}
                  </p>
                );
              })}
            </div>

            <Button
              className="w-full py-2 text-lg font-bold mt-4"
              variant="destructive"
              onClick={stopMeeting}
              disabled={readyStatus !== "ready"}
            >
              {readyStatus === "ready" ? "End Meeting" : "Preparing..."}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewPage;
