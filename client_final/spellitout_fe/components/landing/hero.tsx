import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export const Hero = () => {
  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 py-2">
        <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 py-2">
              Connect instantly with our video calling app
            </h1>
            <p className="max-w-[600px] text-zinc-200 md:text-xl my-6">
              Experience seamless and real-time video calls with transcription
              like never before.
            </p>
            <Button className="bg-gray-700 text-gray-300 py-2 px-4 rounded-md text-lg">
              Get Started
            </Button>
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
