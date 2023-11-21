import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function ifMeetingRunning() {
  try {
    const resp = await axios.get(`${base_url}/status`);
    const { isMeetingRunning } = resp.data;
    return isMeetingRunning;
  } catch (err: any) {
    throw new Error(err?.message);
  }
}
