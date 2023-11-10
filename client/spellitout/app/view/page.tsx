"use client";

import React, { useEffect } from "react";
import connectSocket from "@/lib/socket";

export const ViewPage = () => {
  useEffect(() => {
    connectSocket();
  }, []);
  return <div>ViewPage</div>;
};
export default ViewPage;
