import Link from "next/link";
import ClassesTable from "@/components/ClassesTable";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ClassType } from "@/lib/types";
import { FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Search from "@/components/Search";
import clientInstance from "@/graphql/apollo-client";
import {
  GET_CLASSES,
  GET_CLASSES_BY_NAME,
  REMOVE_CLASS,
} from "@/graphql/classes";
import { ApolloError, useMutation } from "@apollo/client";

export const getServerSideProps = (async (context) => {
  const { name } = context.query;
  let res;
  let classes: ClassType[] = [];
  try {
    if (name) {
      res = await clientInstance.query({
        query: GET_CLASSES_BY_NAME,
        variables: { nameInput: { keyword: name } },
      });
      classes = res.data?.classesByName || [];
    } else {
      res = await clientInstance.query({ query: GET_CLASSES });
      classes = res.data?.classes || [];
    }
    return { props: { classes } };
  } catch (err) {
    console.log(err);
    return { props: { classes: [] } };
  }
}) satisfies GetServerSideProps<{ classes: ClassType[] }>;

export default function Classes({
  classes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [removeClass] = useMutation(REMOVE_CLASS);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = searchRef.current?.value;
    if (value) {
      router.push(`/classes?name=${value}`);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete class ${name}?`)) {
      return;
    }
    try {
      await removeClass({ variables: { idInput: { id } } });
      alert("Class deleted successfully");
      router.reload();
    } catch (err) {
      if (err instanceof ApolloError) {
        alert(err.message || "An error occurred while deleting the class");
      } else {
        alert("An error occurred while deleting the class");
      }
    }
  }

  useEffect(() => {
    if (searchRef.current && router.query.name === undefined) {
      searchRef.current.value = "";
    }
  }, [router.query]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-4 md:px-8">
      <div className="items-center justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Classes
          </h3>
        </div>
        <div className="mt-3 md:mt-0">
          <Link
            href="/classes/new"
            className="inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Add Class
          </Link>
        </div>
      </div>
      <ClassesTable classes={classes} handleDelete={handleDelete}>
        <Search handleSubmit={handleSubmit} searchRef={searchRef} />
      </ClassesTable>
    </div>
  );
}
