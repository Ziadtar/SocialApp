import { useQuery } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import ProfileCard from "../../component/ProfileCard/ProfileCard";

export default function ProfileSaved() {
  async function getUserPostsBookmarks() {
    const allPosts = await axiosInterceptors.get(`users/bookmarks`);
    return allPosts.data?.data?.bookmarks;
  }
  const { data: bookmarksData } = useQuery({
    queryKey: ["ProfilePosts", "bookmarks"],
    queryFn: getUserPostsBookmarks,
  });
  return (
    <>
      {bookmarksData?.map((profileBookMarkedPost) => (
        <ProfileCard key={profileBookMarkedPost._id} MyuserPost={profileBookMarkedPost} />
      ))}
    </>
  );
}
