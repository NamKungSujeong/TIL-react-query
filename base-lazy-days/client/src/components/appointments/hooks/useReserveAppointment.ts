import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// 예약을 위한 변이함수를 반환하는 훅

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const queryclient = useQueryClient();
  const { userId } = useLoginData();

  const toast = useCustomToast();

  //이 함수를 통해 우리의 캘린더는 예약과 함께
  //변이 함수를 실행하여 사용자를 위해 해당 예약을 업데이트할 수 있음
  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({ title: "You have reserved  an appointment!", status: "success" });
    },
  });

  return mutate;
}
