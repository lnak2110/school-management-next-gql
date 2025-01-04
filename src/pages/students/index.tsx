import Link from "next/link";
import StudentsTable from "@/components/StudentsTable";
import { StudentType } from "@/lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SearchStudent from "@/components/SearchStudent";
import { FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import clientInstance from "@/graphql/apollo-client";
import {
  GET_STUDENTS,
  GET_STUDENTS_BY_CLASS_NAME,
  GET_STUDENTS_BY_NAME,
  REMOVE_STUDENT,
} from "@/graphql/students";
import { ApolloError, useMutation } from "@apollo/client";

export const getServerSideProps = (async (context) => {
  const { searchby, name } = context.query;
  let res;
  let students: StudentType[] = [];

  try {
    if (searchby && name) {
      if (searchby === "name") {
        res = await clientInstance.query({
          query: GET_STUDENTS_BY_NAME,
          variables: { nameInput: { keyword: name } },
        });
        students = res.data?.studentsByName || [];
      }
      if (searchby === "class") {
        res = await clientInstance.query({
          query: GET_STUDENTS_BY_CLASS_NAME,
          variables: { classNameInput: { className: name } },
        });
        students = res.data?.studentsByClassName || [];
      }
    } else {
      res = await clientInstance.query({ query: GET_STUDENTS });
      students = res.data?.students || [];
    }
    return { props: { students } };
  } catch (err) {
    console.log(err);
    return { props: { students: [] } };
  }
}) satisfies GetServerSideProps<{ students: StudentType[] }>;

export default function Students({
  students,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [removeStudent] = useMutation(REMOVE_STUDENT);
  const formRef = useRef<HTMLFormElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const searchRefValue = searchRef.current?.value;
    const selectRefValue = selectRef.current?.value;
    if (searchRefValue && selectRefValue) {
      router.push(
        `/students?searchby=${selectRefValue}&name=${searchRefValue}`,
      );
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete student ${name}?`)) {
      return;
    }
    try {
      await removeStudent({ variables: { idInput: { id } } });
      alert("Student deleted successfully");
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
    if (
      (searchRef.current || selectRef.current) &&
      router.query.name === undefined
    ) {
      formRef.current?.reset();
    }
  }, [router.query]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-4 md:px-8">
      <div className="items-center justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Students
          </h3>
        </div>
        <div className="mt-3 md:mt-0">
          <Link
            href="/students/new"
            className="inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Add Student
          </Link>
        </div>
      </div>
      <StudentsTable students={students} handleDelete={handleDelete}>
        <SearchStudent
          handleSubmit={handleSubmit}
          formRef={formRef}
          searchRef={searchRef}
          selectRef={selectRef}
        />
      </StudentsTable>
    </div>
  );
}
