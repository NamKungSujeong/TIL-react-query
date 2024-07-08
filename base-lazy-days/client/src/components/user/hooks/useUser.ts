import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { generateUserKey } from "@/react-query/key-factory";

// query function
async function getUser(userId: number, userToken: string) {
  // userId : 서버에서 어떤 사용자 정보를 요청하는지 알려주기 위함
  // userToken : JWT 헤더를 전달하고 해당 정보에 대한 권한이 있음을 증명하기 위함
  // 이 두개의 값은 useLoginData에서 가지고 올 것
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const { userId, userToken } = useLoginData();
  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
    // 데이터는 가비지 컬렉션 시간이 만료되지 않는 한 다시 가져오지 않으며 사용자가 스스로 업데이트할 경우에만 변경
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
  }

  return { user, updateUser, clearUser };
}
