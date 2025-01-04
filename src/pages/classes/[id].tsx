import clientInstance from "@/graphql/apollo-client";
import { Loading } from "@/components/Loadng";
import { GET_CLASSES, GET_CLASS, UPDATE_CLASS } from "@/graphql/classes";
import { ClassType } from "@/lib/types";
import { ApolloError, useMutation } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  try {
    const res = await clientInstance.query({ query: GET_CLASSES });
    const classes = res.data?.classes;
    paths = classes?.map((c: ClassType) => ({
      params: { id: c.id.toString() },
    }));
  } catch (err) {
    console.log(err || "An error occurred");
  }
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };
  let classData = null;

  try {
    const res = await clientInstance.query({
      query: GET_CLASS,
      variables: { idInput: { id: +id } },
    });
    classData = res.data?.class;
  } catch (err) {
    console.log(err || "An error occurred");
    return { notFound: true };
  }

  return {
    props: { classData },
    revalidate: 10,
  };
};

export default function ClassDetail({ classData }: { classData: ClassType }) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [updateClass] = useMutation(UPDATE_CLASS);
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const id = router.query.id;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameValue = nameRef.current?.value;
    setFormSubmitted(true);

    if (!id) {
      return;
    }

    try {
      await updateClass({
        variables: {
          updateClassInput: {
            id: +id,
            name: nameValue,
          },
        },
      });

      if (nameRef.current) {
        nameRef.current.value = "";
      }
      alert("Class updated successfully. You will be redirected.");
      router.push("/classes");
    } catch (err) {
      if (err instanceof ApolloError) {
        alert(err.message || "An error occurred");
      } else {
        alert("An error occurred");
      }
    } finally {
      setFormSubmitted(false);
    }
  }

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <main className="flex w-full flex-col items-center justify-center sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Class {classData.name}
            </h3>
          </div>
        </div>
        <div className="bg-white p-4 py-6 shadow sm:rounded-lg sm:p-6">
          <form onSubmit={handleSubmit} method="post" className="space-y-5">
            <div>
              <label className="font-medium" htmlFor="id">
                ID
              </label>
              <input
                type="number"
                name="id"
                id="id"
                value={classData.id}
                required
                readOnly
                disabled
                className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="font-medium" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={classData.name}
                ref={nameRef}
                required
                className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="font-medium" htmlFor="studentsCount">
                Number of students
              </label>
              <input
                type="number"
                name="studentsCount"
                id="studentsCount"
                value={classData.students.length}
                required
                readOnly
                disabled
                className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <button
              disabled={formSubmitted}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white duration-150 hover:bg-indigo-500 active:bg-indigo-600"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
