const base_url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
import axios from "axios";


const joinMeeting = async (params: any) => {
    const { inp, out, socketId } = params;
    const resp = await axios.post(`${base_url}/join`, { inputLang: inp, outputLang: out, socketClientId: socketId });
    return resp.data;
}

const stopMeeting = async () => {
    const resp = await axios.post(`${base_url}/stop`, { password: localStorage.getItem("password") });
    return resp.data;
}

export default { joinMeeting, stopMeeting }