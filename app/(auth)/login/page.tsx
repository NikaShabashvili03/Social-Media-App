import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";
export default async function page() {

  const currentUser = await getCurrentUser();

  if(currentUser){
    redirect('/')
  }

  return <LoginClient/>;
}
