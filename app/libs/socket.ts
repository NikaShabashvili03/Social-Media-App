'use client'
import io from "socket.io-client";

const socket = io({
    path: 'https://roaring-twilight-b141de.netlify.app/api/socket_io',
})

export default socket;