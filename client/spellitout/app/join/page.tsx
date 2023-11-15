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
        <Select onValueChange={(val) => {
          setInputLang(val);
        }}>
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Select Input Language" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="en">
              English
            </SelectItem>
            <SelectItem value="es">
              Spanish
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => {
          setOutputLang(val);
        }}>
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Select Output Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en" onChange={() => setOutputLang("en")}>
              English
            </SelectItem>
            <SelectItem value="es" onChange={() => setOutputLang("es")}>
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
