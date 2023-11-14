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
    } finally {
      setPassword("");
    }
  };

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  return (
    <div className="h-screen bg-slate-800 text-white flex items-center justify-center flex-col gap-y-4 ">
      <h3 className="text-xl">Please Enter your password below</h3>
      <Input
        type="text"
        placeholder="John Doe"
        onChange={handleChange}
        value={password}
        className="max-w-xl border-4 border-red-800 text-black"
      />
      <div className="w-[36rem]">
        {" "}
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full hover:bg-slate-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
export default StartPage;
