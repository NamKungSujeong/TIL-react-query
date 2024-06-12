import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    // data : 페이지를 계속 로드할 때 여기에 data의 페이지가 포함
    // fetchNextPage : 더 많은 데이터가 필요할 때 어느 함수를 실행할지 infiniteScroll에 지시하는 역할
    // hasNextPage : 수집할 데이터가 더 있는지를 결정하는 boolean
    queryKey: ["sw-people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    // 이 쿼리 함수는 객체 매개변수를 받고 프로퍼티 중 하나로 pageParam을 가지고 있음
    // initialUrl로 기본값 설정
    getNextPageParam: (lastPage) => {
      // 이 옵션은 lastPage를 가진 함수
      // 우리가 사용할 Star Wars API는 다음 페이지의 url을 가진 next 프로퍼티가 있음
      // lastPage를 가져와서 pageParam을 lastPage.next로 작성
      return lastPage.next;
      // fetchNextPage를 실행하면 next 프로퍼티가 무엇인지에 따라 마지막 페이지에 도착한 다음 pageParam을 사용
      // HasNextPage는 이 함수가 undefined를 반환하는지에 아닌지에 따라 결정
    },
  });

  // useQuery와 마찬가지로 error, loading 설정
  // isFetching을 사용하지 않는 이유는 새로운 페이지를 가지고 올때마다 조기반환 되기 때문에 스크롤이 원위치되는 문제가 있음
  if (isLoading) {
    return <div className="loading">Loading....</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading....</div>}
      {/* isFetching을 여기 위치시켜서 조기반환되지 않고 새로운 페이지를 불러올 때마다 로딩 띄워주기 */}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
          // isFetching이 아니면 fetchNextPage() 실행해서 다음 페이지 가져오기
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hairColor}
                eyeColor={person.eyeColor}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
