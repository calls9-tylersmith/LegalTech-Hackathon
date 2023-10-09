import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Answer } from "../../types/Answer";
import { ImageToText } from "../Form/ImageToText";

import styles from "../../styles/pages/answers/create.module.css";

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
  const [visibleCheckbox, setVisibleCheckbox] = useState<boolean>(false);
  const [safetyCheckbox, setSafetyCheckbox] = useState<boolean>(false);
  const [qualityCheckbox, setQualityCheckbox] = useState<boolean>(false);
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
    <div className={styles.main + " container mx-auto px-4 max-w-2xl mt-4"}>
      {/* <Link
        href="/answers"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link> */}
      <h1 className={styles.title + " text-3xl my-2"}>
        {answer ? `Edit Answer ${answer["@id"]}` : `Please select the fault with your product?`}
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
            <div className={styles.field + "mb-2"}>
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_aiFaults"
              >
                Upload an image of the problem
              </label>
              <ImageToText
                question="What is the wrong with this clothing?"
                setOutput={(output) => {
                  handleChange({
                    target: {
                      name: "aiFaults",
                      value: output,
                    },
                  });
                }}
              />
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_aiFaults"
              >
                AI Verdict (hidden field)
              </label>
              <input
                name="aiFaults"
                id="answer_aiFaults"
                value={values.aiFaults ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.aiFaults && touched.aiFaults ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.aiFaults && touched.aiFaults ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="aiFaults"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_visibleFaults"
              >
                visibleFaults
              </label>
              {/* A checkbox that hides the field */}
              <input type="checkbox" id="hide" name="hide" onChange={(e:any) => setVisibleCheckbox(!visibleCheckbox)} />
              <input
                style={{ display: visibleCheckbox ? "block" : "none" }}
                name="visibleFaults"
                id="answer_visibleFaults"
                value={values.visibleFaults ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.visibleFaults && touched.visibleFaults
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.visibleFaults && touched.visibleFaults
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="visibleFaults"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_safetyFaults"
              >
                safetyFaults
              </label>

              <input type="checkbox" id="hide" name="hide" onChange={(e:any) => setSafetyCheckbox(!safetyCheckbox)} />
              <input
                style={{ display: safetyCheckbox ? "block" : "none" }}
                name="safetyFaults"
                id="answer_safetyFaults"
                value={values.safetyFaults ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.safetyFaults && touched.safetyFaults
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.safetyFaults && touched.safetyFaults
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="safetyFaults"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="answer_qualityFaults"
              >
                qualityFaults
              </label>
              
              <input type="checkbox" id="hide" name="hide" onChange={(e:any) => setQualityCheckbox(!qualityCheckbox)} />
              <input
                style={{ display: qualityCheckbox ? "block" : "none" }}
                name="qualityFaults"
                id="answer_qualityFaults"
                value={values.qualityFaults ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.qualityFaults && touched.qualityFaults
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.qualityFaults && touched.qualityFaults
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="qualityFaults"
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
