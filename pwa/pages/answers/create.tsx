import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/answer/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Answer</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
