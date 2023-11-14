"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      const resp = await axios.get(`${base_url}/status`);
      const { isMeetingRunning } = resp.data;
      if (isMeetingRunning) {
        router.push("/join");
      } else {
        router.push("/start");
      }
    } catch (err: any) {
      console.log("Error in console");
      console.log(err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: err?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-slate-800 text-white w-full flex items-center justify-center flex-col gap-y-4 ">
      <div className="text-2xl">SpellitOut</div>
      <Button
        className=" text-white py-2 px-4 rounded-md text-lg hover:bg-gray-700"
        onClick={handleClick}
      >
        Get Started
      </Button>
    </div>
  );
}
