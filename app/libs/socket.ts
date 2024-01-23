'use client'
import io from "socket.io-client";

const socket = io({
    path: 'https://roaring-twilight-b141de.netlify.app:3001/api/socket_io',
})

export default socket;