import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Address } from "../types/address";

import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../services/addressService";

const ADDRESS_QUERY_KEY = ["addresses"];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: getAddresses,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      address: Omit<
        Address,
        "id" | "createdAt" | "updatedAt"
      >
    ) => addAddress(address),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      address,
    }: {
      id: string;
      address: Partial<Address>;
    }) => updateAddress(id, address),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEY,
      });
    },
  });
}