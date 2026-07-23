import { useQuery } from "@tanstack/react-query";

import {
  getUserProfile,
  type UserProfile,
} from "../services/profileService";

const PROFILE_QUERY_KEY = ["profile"];

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getUserProfile,
  });
}