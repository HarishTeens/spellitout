
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ifMeetingRunning } from "@/lib/utils";

export const Hero = () => {
  const [isMeetingRunning, setIsMeetingRunning] = useState(false);
  const [ifServerError, setIfServerError] = useState(false);

  useEffect(() => {
    const checkMeeting = async () => {
      try {
        const result = await ifMeetingRunning();
        setIsMeetingRunning(result);
      } catch (err) {
        console.log(err);
        setIfServerError(true);
      }
    };
    checkMeeting();
  }, []);

  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 py-2">
        <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 py-2">
              Enabling borderless conversations.
            </h1>
            <p className="max-w-[600px] text-zinc-200 md:text-xl my-6">
              Experience seamless and real-time transcription like never before.
            </p>

            {ifServerError ? (
              <Button
                className="bg-gray-700 text-gray-300 py-2 px-4 rounded-md text-lg"
                disabled
              >
                Backend Server Error
              </Button>
            ) : (
              <Link href={isMeetingRunning ? "/join" : "/start"}>
                <Button className="bg-gray-700 text-gray-300 py-2 px-4 rounded-md text-lg">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative h-0 pb-[45.25%] lg:pb-[56.25%] pt-8">
              <Image
                alt="video"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-md aspect-video"
                height={500}
                width={500}
                src="/placeholder.svg"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
