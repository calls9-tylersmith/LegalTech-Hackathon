import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Answer } from "../../types/Answer";
import { ImageToText } from "../Form/ImageToText";

interface Props {
  answer?: Answer;
}

interface SaveParams {
  values: Answer;
}

interface DeleteParams {
  id: string;
}

const saveAnswer = async ({ values }: SaveParams) =>
  await fetch<Answer>(!values["@id"] ? "/answers" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteAnswer = async (id: string) =>
  await fetch<Answer>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ answer }) => {

  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Answer> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveAnswer(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Answer> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteAnswer(id), {
    onSuccess: () => {
      router.push("/answers");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!answer || !answer["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: answer["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/answers"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {answer ? `Edit Answer ${answer["@id"]}` : `Create Answer`}
      </h1>
      <Formik
        initialValues={
          answer
            ? {
                ...answer,
              }
            : new Answer()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/answers");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_name"
              >
                name
              </label>
              <input
                name="name"
                id="answer_name"
                value={values.name ?? ""}
                type="text"
                placeholder="A nice person"
                required={true}
                className={`mt-1 block w-full ${
                  errors.name && touched.name ? "border-red-500" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_issueType"
              >
                issueType
              </label>
              <input
                name="issueType"
                id="answer_issueType"
                value={values.issueType ?? ""}
                type="text"
                placeholder="issueType enum"
                required={true}
                className={`mt-1 block w-full ${
                  errors.issueType && touched.issueType ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.issueType && touched.issueType ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="issueType"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_visualDefects"
              >
                visualDefects
              </label>
              <ImageToText
                question="Describe what's wrong with this clothing?"
                setOutput={(value) => {
                  handleChange({
                    target: {
                      name: "visualDefects",
                      value,
                    },
                  });
                }}
              />
              <input
                name="visualDefects"
                id="answer_visualDefects"
                value={values.visualDefects ?? ""}
                type="text"
                placeholder="What are the visual defects?"
                required={true}
                className={`mt-1 block w-full ${
                  errors.visualDefects && touched.visualDefects
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.visualDefects && touched.visualDefects
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="visualDefects"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_image"
              >
                image
              </label>
              <input
                name="image"
                id="answer_image"
                value={values.image ?? ""}
                type="text"
                placeholder="A reference Image"
                required={true}
                className={`mt-1 block w-full ${
                  errors.image && touched.image ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.image && touched.image ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="image"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {answer && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
