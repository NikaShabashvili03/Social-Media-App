'use client';

import { useEffect } from "react";
import socket from "../libs/socket";
import { SafeUser } from "../types";

interface ContainerProps {
  children: React.ReactNode,
  currentUser: SafeUser | null
};


const SocketContext: React.FC<ContainerProps> = ({ children, currentUser }) => {
  useEffect(() => {
    if(currentUser){
      socketInitializer();

      socket.emit('user-status', {
        id: currentUser?.id
      })
    }
  }, [])

  const socketInitializer = async () => {
    await fetch('https://social-media-app-psi-three.vercel.app/api/sockets/socket');
    if(!socket.connected){
        socket.on('disconnect', () => {
            console.log("Disconnect")
        })
    }else{
        socket.on('connect', () => {
            console.log("Connected", socket.id)
        })
    }
  }

  return (
    <>
      {children}
    </>
   );
}

export default SocketContext;
