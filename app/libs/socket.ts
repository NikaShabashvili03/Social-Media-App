'use client'
import io from "socket.io-client";

const socket = io({
    path: 'https://social-media-mqur4fojf-nikashabashvili03.vercel.app:3001/api/socket_io',
})

export default socket;