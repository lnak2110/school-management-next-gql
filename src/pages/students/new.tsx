import CreateStudentForm from "@/components/CreateStudentForm";
import { GET_CLASSES } from "@/graphql/classes";
import { CREATE_STUDENT } from "@/graphql/students";
import { ClassType } from "@/lib/types";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState, useRef, FormEvent, useEffect } from "react";

export default function CreateStudent() {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const { data } = useQuery(GET_CLASSES);
  const [createStudent] = useMutation(CREATE_STUDENT);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const classIdRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameValue = nameRef.current?.value;
    const classIdValue = +classIdRef.current!.value;
    setFormSubmitted(true);

    try {
      await createStudent({
        variables: {
          createStudentInput: {
            name: nameValue,
            classId: classIdValue,
          },
        },
      });
      formRef.current?.reset();
      alert("Student created successfully. You will be redirected.");
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

  useEffect(() => {
    if (data) {
      setClasses(data.classes);
    }
  }, [data]);

  return (
    <CreateStudentForm
      formRef={formRef}
      nameRef={nameRef}
      classIdRef={classIdRef}
      handleSubmit={handleSubmit}
      classes={classes}
      formSubmitted={formSubmitted}
    />
  );
}
