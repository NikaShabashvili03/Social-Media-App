import { redirect } from "next/navigation";
import getCurrentUser from "./actions/getCurrentUser";
import PostFeed from "./components/PostFeed";
import getAllPosts from "./actions/getAllPosts";
import SharePost from "./components/Post/SharePost";


export default async function Home() {
  const currentUser = await getCurrentUser();
  const getAllUser = await getAllPosts();

  return (
   <div className="bg-gray-200 min-h-screen">
      {currentUser && (<SharePost currentUser={currentUser}/>)}
      <PostFeed currentUser={currentUser} AllPosts={getAllUser}/>
   </div>
  );
}
