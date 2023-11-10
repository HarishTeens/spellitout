const baseUrl = process.env.REACT_APP_SERVER_URL;

const getStatus = async () => {
    const response = await fetch(`${baseUrl}/status`);
    const data = await response.json();
    return data.isMeetingRunning;
}