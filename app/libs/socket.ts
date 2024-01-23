'use client'
import io from "socket.io-client";

const socket = io({
    path: 'https://social-media-app-psi-three.vercel.app/api/socket_io',
})

export default socket;