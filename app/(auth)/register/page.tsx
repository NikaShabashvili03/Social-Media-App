import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";


export default async function page() {
    
    const currentUser = await getCurrentUser();
    if(currentUser){
      redirect('/')
    }
    return <RegisterClient/>;
  }
  