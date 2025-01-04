import clientInstance from "@/graphql/apollo-client";
import ClassSelect from "@/components/ClassSelect";
import { Loading } from "@/components/Loadng";
import { GET_CLASSES } from "@/graphql/classes";
import { GET_STUDENTS, GET_STUDENT, UPDATE_STUDENT } from "@/graphql/students";
import { ClassType, StudentType } from "@/lib/types";
import { ApolloError, useMutation } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  try {
    const res = await clientInstance.query({ query: GET_STUDENTS });
    const students = res.data?.students;
    paths = students?.map((s: StudentType) => ({
      params: { id: s.id.toString() },
    }));
  } catch (err) {
    console.log(err || "An error occurred");
  }
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };
  let studentData = null;
  let classes = [];

  try {
    const res = await clientInstance.query({
      query: GET_STUDENT,
      variables: { idInput: { id: +id } },
    });
    studentData = res.data?.student;
    const resClasses = await clientInstance.query({ query: GET_CLASSES });
    classes = resClasses.data?.classes;
  } catch (err) {
    console.log(err || "An error occurred");
    return { notFound: true };
  }

  return {
    props: { studentData, classes },
    revalidate: 10,
  };
};

type StudentDetailProps = {
  studentData: StudentType;
  classes: ClassType[];
};

export default function StudentDetail({
  studentData,
  classes,
}: StudentDetailProps) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [updateStudent] = useMutation(UPDATE_STUDENT);
  const nameRef = useRef<HTMLInputElement>(null);
  const classIdRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();
  const id = router.query.id;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameValue = nameRef.current?.value;
    const classIdValue = classIdRef.current!.value;
    setFormSubmitted(true);

    if (!id) {
      return;
    }

    try {
      await updateStudent({
        variables: {
          updateStudentInput: {
            id: +id,
            name: nameValue,
            classId: +classIdValue,
          },
        },
      });

      if (nameRef.current) {
        nameRef.current.value = "";
      }
      alert("Student updated successfully. You will be redirected.");
      router.push("/students");
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
              Student {studentData.name}
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
                value={studentData.id}
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
                defaultValue={studentData.name}
                ref={nameRef}
                required
                className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <ClassSelect
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
              classIdRef={classIdRef}
              defaultValue={studentData.classId}
            />
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
