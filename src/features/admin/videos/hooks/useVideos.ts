import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addVideo,
  deleteVideo,
  getVideos,
  updateVideo,
} from "../services/videoService";

import type { VideoCardFormData } from "../types/video";

export const VIDEOS_QUERY_KEY = [
  "homepage-videos",
];

export function useVideos() {
  return useQuery({
    queryKey: VIDEOS_QUERY_KEY,
    queryFn: getVideos,
  });
}

export function useAddVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VideoCardFormData) =>
      addVideo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VIDEOS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: VideoCardFormData;
    }) => updateVideo(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VIDEOS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      publicId?: string;
    }) => deleteVideo(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VIDEOS_QUERY_KEY,
      });
    },
  });
}