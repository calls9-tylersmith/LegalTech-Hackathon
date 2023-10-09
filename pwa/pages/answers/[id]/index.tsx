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

import { Show } from "../../../components/answer/Show";
import { PagedCollection } from "../../../types/collection";
import { Answer } from "../../../types/Answer";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getAnswer = async (id: string | string[] | undefined) =>
  id ? await fetch<Answer>(`/answers/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: answer, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Answer> | undefined>(["answer", id], () =>
      getAnswer(id)
    );
  const answerData = useMercure(answer, hubURL);

  if (!answerData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Answer ${answerData["@id"]}`}</title>
        </Head>
      </div>
      <Show answer={answerData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["answer", id], () => getAnswer(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Answer>>("/answers");
  const paths = await getItemPaths(response, "answers", "/answers/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
