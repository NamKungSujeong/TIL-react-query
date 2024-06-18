import { toast } from "@/components/app/toast";
import { QueryCache, QueryClient } from "@tanstack/react-query";

function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";
  // 중복된 토스트 메세지가 표시되지 않도록 id 설정

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

// errorHandler를 뭐리태시 옵션에 제공해주기
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
});
