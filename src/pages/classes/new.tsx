import CreateClassForm from "@/components/CreateClassForm";
import { CREATE_CLASS } from "@/graphql/classes";
import { ApolloError, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState, useRef, FormEvent } from "react";

export default function CreateClass() {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [createClass] = useMutation(CREATE_CLASS);
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameValue = nameRef.current?.value;
    setFormSubmitted(true);

    try {
      await createClass({
        variables: {
          createClassInput: {
            name: nameValue,
          },
        },
      });

      if (nameRef.current) {
        nameRef.current.value = "";
      }
      alert("Class created successfully. You will be redirected.");
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

  return (
    <CreateClassForm
      nameRef={nameRef}
      handleSubmit={handleSubmit}
      formSubmitted={formSubmitted}
    />
  );
}
