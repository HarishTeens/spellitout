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
import { TextField} from "@radix-ui/themes";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const JoinPage = () => {
  const router = useRouter();

  const [inputLang, setInputLang] = useState("");
  const [outputLang, setOutputLang] = useState("");
  const [name, setName] = useState("")

  const handleSubmit = () => {
    localStorage.setItem("inputLang", inputLang);
    localStorage.setItem("outputLang", outputLang);
    localStorage.setItem("name", name[0].toUpperCase() + name.slice(1));

    router.push("/view");
  };

  return (
    <main className=" h-screen bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-center flex-col gap-y-4">
      <div className="flex items-center justify-evenly gap-2 flex-col">
        <TextField.Root className={"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"}>
          <TextField.Input className={"w-full"} variant={"surface"} style={{color:"black"}}  placeholder="name" type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
        </TextField.Root>
          
        <Select
          onValueChange={(val) => {
            setInputLang(val);
          }}
        >
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Enter the language you will be speaking in here:" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (<SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) => {
            setOutputLang(val);
          }}
        >
          <SelectTrigger className="w-[500px] text-black">
            <SelectValue placeholder="Enter the language you want to be translated into here:" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (<SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>))}
          </SelectContent>
        </Select>

        <Button
          className="w-[500px] hover:bg-slate-900 bg-gray-700"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </main>
  );
};

export default JoinPage;
