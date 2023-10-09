import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Answer } from "../../types/Answer";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getAnswersPath = (page?: string | string[] | undefined) =>
  `/answers${typeof page === "string" ? `?page=${page}` : ""}`;
export const getAnswers = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Answer>>(getAnswersPath(page));
const getPagePath = (path: string) =>
  `/answers/page/${parsePage("answers", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: answers, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Answer>> | undefined
  >(getAnswersPath(page), getAnswers(page));
  const collection = useMercure(answers, hubURL);
  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Answer List</title>
        </Head>
      </div>
      <List answers={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
