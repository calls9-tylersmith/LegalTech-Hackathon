import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getAnswerss,
  getAnswerssPath,
} from "../../../components/answers/PageList";
import { PagedCollection } from "../../../types/collection";
import { Answers } from "../../../types/Answers";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getAnswerssPath(page), getAnswerss(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Answers>>("/answers");
  const paths = await getCollectionPaths(
    response,
    "answers",
    "/answerss/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
