import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, userToken: string) => {
  return [queryKeys.user, userId, userToken];
};

export const generateUserAppointmentKey = (
  userId: number,
  userToken: string
) => {
  return [queryKeys.user, queryKeys.user, userId, userToken];
};
