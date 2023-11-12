"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const StartPage = () => {
  const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const router = useRouter();

  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    axios
      .post(`${base_url}/start`, {
        password: password,
      })
      .then((response) => {
        router.push("/view");
      });
  };

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 bg-slate-800">
      <Input type="text" placeholder="Password" onChange={handleChange} />
      <Button type="submit" onClick={handleSubmit}>
        Subscribe
      </Button>
    </div>
  );
};
export default StartPage;
