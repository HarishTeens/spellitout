"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Button } from "@/components/ui/button";

const JoinPage = () => {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  const [inputLang, setInputLang] = useState("");
  const [outputLang, setOutputLang] = useState("");

  const handleSubmit = () => {
    localStorage.setItem("inputLang", inputLang);
    localStorage.setItem("outputLang", outputLang);
  };

  return (
    <main className=" bg-white">
      <div className="text-slate-800">Sexy Harish</div>
      <div className="flex items-center justify-evenly gap-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            Select Input Language
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setInputLang("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setInputLang("es")}>
              Spanish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="">
            Select Output Language
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOutputLang("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOutputLang("es")}>
              Spanish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </main>
  );
};

export default JoinPage;
