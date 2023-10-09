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

import { Show } from "../../../components/answers/Show";
import { PagedCollection } from "../../../types/collection";
import { Answers } from "../../../types/Answers";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getAnswers = async (id: string | string[] | undefined) =>
  id ? await fetch<Answers>(`/answers/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: answers, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Answers> | undefined>(["answers", id], () =>
      getAnswers(id)
    );
  const answersData = useMercure(answers, hubURL);

  if (!answersData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Answers ${answersData["@id"]}`}</title>
        </Head>
      </div>
      <Show answers={answersData} text={text} />
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
  const paths = await getItemPaths(response, "answers", "/answerss/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
