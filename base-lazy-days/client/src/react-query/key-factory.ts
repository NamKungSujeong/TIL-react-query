import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, userToken: string) => {
  // 토큰이 변경되더라도 사용자 ID에 대한 키를 동일하게 유지하기 위해 userToken을 삭제
  return [queryKeys.user, userId];
};

export const generateUserAppointmentKey = (
  userId: number,
  userToken: string
) => {
  return [queryKeys.user, queryKeys.user, userId, userToken];
};
