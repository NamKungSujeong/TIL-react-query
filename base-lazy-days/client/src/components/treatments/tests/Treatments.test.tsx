import { render, screen } from "@/test-utils";

import { Treatments } from "../Treatments";

test("renders response from query", () => {
  // write test here
  // 테스팅 라이브러리에서 테스트를 작성하거나 시작하는 방식은 컴포넌트를 렌더링하는 것
  render(<Treatments />);
});
