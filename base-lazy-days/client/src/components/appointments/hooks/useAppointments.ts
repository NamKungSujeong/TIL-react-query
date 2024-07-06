import { useEditable } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

const commonOptions = {
  staleTime: 0,
  gcTime: 30000,
};
// appointments는 실시간으로 그 내용이 바뀔 수 있기 때문에
// 기본값으로 설정된 리패치 시간보다 완화된 시간을 적용해서 리패치 처리를 해줌

// for useQuery call
async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments() {
  const queryClient = useQueryClient();

  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [
        queryKeys.appointments,
        nextMonthYear.year,
        nextMonthYear.month,
      ],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      ...commonOptions,
    });
  }, [monthYear, queryClient]);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { userId } = useLoginData();

  const selectFn = useCallback(
    (data: AppointmentDateMap, showAll: boolean) => {
      if (showAll) return data;
      return getAvailableAppointments(data, userId);
    },
    [userId]
  );

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  // TODO: update with useQuery!
  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month
  const fallback: AppointmentDateMap = {};

  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    // 모든 쿼리에 동일한 키를 사용할 경우 달력이 넘어가도 데이터가 바뀌지 않음
    // 새 달을 로드하기 위해 화살표를 클릭해도 새로운 데이터를 다시 가져오기 위한 트리거가 없음
    // 해결책은 매 달마다 새로운 키를 사용하는 것
    // 이를 위해 키는 항상 종속성 배열로 처리해야 함.
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll),
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
    // refetchInterval은 정말 편리하고 매우 쉬우며, 정기적으로 데이터를 최신 상태로 유지할 수 있음
    ...commonOptions,
  });

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
