export default function (socket) {
    console.log("socket: client connected");
    socket.on("disconnect", () => {
        console.log("socket: client disconnected");
    });
}

