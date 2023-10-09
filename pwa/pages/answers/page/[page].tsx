import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getAnswers,
  getAnswersPath,
} from "../../../components/answer/PageList";
import { PagedCollection } from "../../../types/collection";
import { Answer } from "../../../types/Answer";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getAnswersPath(page), getAnswers(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Answer>>("/answers");
  const paths = await getCollectionPaths(
    response,
    "answers",
    "/answers/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
