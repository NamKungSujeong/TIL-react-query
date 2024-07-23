import { render, screen } from "@/test-utils";

import { Treatments } from "../Treatments";

test("renders response from query", async () => {
  // write test here
  // 테스팅 라이브러리에서 테스트를 작성하거나 시작하는 방식은 컴포넌트를 렌더링하는 것
  render(<Treatments />);

  // 쿼리 응답이 렌더링 되는 것을 테스트 하는 방법은 각 제목을 렌더링 하는 것
  // screen : 우리가 렌더링 결과에 접근하는 방법
  // findBy : 우리가 기다리고 있다는 것을 의미 따라서 비동기적으로 동작
  const treatmentTitles = await screen.findAllByRole("heading", {
    name: /massage|facial|scrub/i,
  });

  expect(treatmentTitles).toHaveLength(3);
});
