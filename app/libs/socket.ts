import io from "socket.io-client";

const socket = io({
    path: 'social-media-app-gamma-three.vercel.app/api/socket_io',
})

export default socket;