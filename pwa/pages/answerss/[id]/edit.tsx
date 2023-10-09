import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/answers/Form";
import { PagedCollection } from "../../../types/collection";
import { Answers } from "../../../types/Answers";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getAnswers = async (id: string | string[] | undefined) =>
  id ? await fetch<Answers>(`/answers/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: answers } = {} } = useQuery<
    FetchResponse<Answers> | undefined
  >(["answers", id], () => getAnswers(id));

  if (!answers) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{answers && `Edit Answers ${answers["@id"]}`}</title>
        </Head>
      </div>
      <Form answers={answers} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["answers", id], () => getAnswers(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Answers>>("/answers");
  const paths = await getItemPaths(response, "answers", "/answerss/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
