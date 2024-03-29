import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import SocketContext from "./context/SocketContext";
import getCurrentUser from "./actions/getCurrentUser";
import ModalContext from "./context/ModalContext";
import Sidebar from "./components/Sidebar";
import getMessagesByConversation from "./actions/getMessagesByConversation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const currentUser = await getCurrentUser();
  const messages = await getMessagesByConversation();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext/>
        <ModalContext currentUser={currentUser}/>
        <SocketContext currentUser={currentUser}>
          <Sidebar messages={messages} currentUser={currentUser}>
           {children}
          </Sidebar>
        </SocketContext>
      </body>
    </html>
  );
}
