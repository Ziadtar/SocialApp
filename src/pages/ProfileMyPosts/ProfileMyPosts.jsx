import { useContext } from "react";
import { AuthContext } from "../../component/context/AuthContextProvider/AuthContextProvider";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../../component/ProfileCard/ProfileCard";

export default function ProfileMyPosts() {
  const { userData } = useContext(AuthContext);
  const { id } = userData || {};

  async function getUserPosts() {
    const allPosts = await axiosInterceptors.get(`users/${id}/posts`);
    return allPosts.data?.data?.posts; 
  }
  const { data } = useQuery({
    queryKey: ["ProfilePosts", "newposts"],
    queryFn: getUserPosts,
  });
  
  return (
    <>
      {data?.map((profilepost) => (
        <ProfileCard key={profilepost._id} MyuserPost={profilepost} />
      ))}
    </>
  );
}
