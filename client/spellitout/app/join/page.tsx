"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

const JoinPage = () => {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();

  const [inputLang, setInputLang] = useState("");
  const [outputLang, setOutputLang] = useState("");

  const handleSubmit = () => {
    localStorage.setItem("inputLang", inputLang);
    localStorage.setItem("outputLang", outputLang);

    router.push("/view");
  };

  return (
    <main className=" h-screen bg-slate-800 text-white flex items-center justify-center flex-col gap-y-4">
      <div className="text-slate-800">Sexy Harish</div>
      <div className="flex items-center justify-evenly gap-2 flex-col">
        <Select>
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Select Input Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en" onClick={() => setInputLang("en")}>
              English
            </SelectItem>
            <SelectItem value="es" onClick={() => setInputLang("es")}>
              Spanish
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Select Output Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en" onClick={() => setOutputLang("en")}>
              English
            </SelectItem>
            <SelectItem value="es" onClick={() => setOutputLang("es")}>
              Spanish
            </SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-[500px]" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </main>
  );
};

export default JoinPage;
