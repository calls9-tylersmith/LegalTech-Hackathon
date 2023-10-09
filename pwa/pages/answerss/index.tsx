import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getAnswerss,
  getAnswerssPath,
} from "../../components/answers/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getAnswerssPath(), getAnswerss());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
