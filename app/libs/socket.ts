'use client'
import io from "socket.io-client";

const socket = io({
    path: '/api/socket_io',
})

export default socket;