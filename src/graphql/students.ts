import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const GET_STUDENTS_BY_NAME = gql`
  query GetStudentsByName($nameInput: NameInput!) {
    studentsByName(nameInput: $nameInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const GET_STUDENTS_BY_CLASS_NAME = gql`
  query GetStudentsByClassName($classNameInput: ClassNameInput!) {
    studentsByClassName(classNameInput: $classNameInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($idInput: IdInput!) {
    student(idInput: $idInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const CREATE_STUDENT = gql`
  mutation CreateStudent($createStudentInput: CreateStudentInput!) {
    createStudent(createStudentInput: $createStudentInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($updateStudentInput: UpdateStudentInput!) {
    updateStudent(updateStudentInput: $updateStudentInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;

export const REMOVE_STUDENT = gql`
  mutation RemoveStudent($idInput: IdInput!) {
    removeStudent(idInput: $idInput) {
      id
      name
      classId
      class {
        id
        name
      }
    }
  }
`;
