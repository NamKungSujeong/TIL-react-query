import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback: Treatment[] = [];
  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    staleTime: 600000,
    gcTime: 900000,
    // stale time이 가비지 수집 시간을 초과하면 표시할 내용이 전혀 없게 되기 때문에
    // 가비지 시간도 늘려주기
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return data;
}

export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    // 어떤 쿼리, 어떤 useQuery가 캐시에서 이 데이터를 찾아야 하는지를 알려주기 때문에 키가 매우 중용
    queryFn: getTreatments,
    staleTime: 600000,
    gcTime: 900000,
  });
}
