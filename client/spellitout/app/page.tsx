"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${base_url}/status`)
      .then((response) => {
        const { isMeetingRunning } = response.data;

        if (isMeetingRunning) {
          router.push("/join");
        } else {
          router.push("/start");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [base_url, router]);

  return (
    <div className="h-screen bg-slate-800 text-white w-full flex items-center justify-center">
      Hi This is the First Meeting Page
    </div>
  );
}
