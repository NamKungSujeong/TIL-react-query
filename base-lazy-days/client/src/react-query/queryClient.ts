import { toast } from "@/components/app/toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

function createTitle(errorMsg: string, actionType: "query" | "mutation") {
  const action = actionType === "query" ? "fetch" : "update";
  return `could not ${action} data: ${
    errorMsg ?? "error connecting to server"
  }`;
}

function errorHandler(title: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";
  // 중복된 토스트 메세지가 표시되지 않도록 id 설정

  if (!toast.isActive(id)) {
    // const action = "fetch";
    // const title = `could not ${action} data: ${
    //   errorMsg ?? "error connecting to server"
    // }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

// errorHandler를 뭐리태시 옵션에 제공해주기
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
      gcTime: 900000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const title = createTitle(error.message, "mutation");
      errorHandler(title);
    },
  }),
});
