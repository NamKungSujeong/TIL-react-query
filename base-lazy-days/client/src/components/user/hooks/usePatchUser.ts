import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";

import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = "patch-user";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: (userData: User | null) => updateUser(userData),
    onSettled: () => {
      // invalidateQueries가 완료되고 서버에서 새로운 데이터를 받을 때까지 변형이 진행 중인 상태를 유지하기 위해 이 프로미스를 반환해야 함
      return queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
    },
    // onSettled : 성공과 오류가 결합된 것
    // 변형이 해결되면, 성공이든 오류든 상관없이 onSettled가 실행
  });

  return patchUser;
}
