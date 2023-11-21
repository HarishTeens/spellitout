"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const StartPage = () => {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();
  const { toast } = useToast();

  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      localStorage.clear();
      localStorage.setItem("password", password);
      const resp = await axios.post(`${base_url}/start`, {
        password: password,
      });
      console.log(resp);
      router.push("/join");
      setPassword("");
    } catch (err: any) {
      console.log(err);
      const outp = err?.response?.data?.message;
      if (outp == "Meeting already running") {
        router.push("/join");
        return;
      }
      toast({
        title: "Uh oh! Something went wrong.",

        description: outp ?? "Enter correct password",
        variant: "destructive",
      });
    }
  };

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-center flex-col gap-y-4 mx-auto  px-4 md:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 font-bold mb-8 text-center">
        Please Enter your password below
      </h1>
      <div className="w-full max-w-lg flex flex-col items-center space-y-4 text-black">
        <Input
          type="text"
          placeholder="John Doe"
          onChange={handleChange}
          value={password}
          className="w-full border-4 border-red-800 "
        />{" "}
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full hover:bg-slate-900 bg-gray-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
export default StartPage;
