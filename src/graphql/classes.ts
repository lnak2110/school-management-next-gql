import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query GetClasses {
    classes {
      id
      name
      students {
        id
        name
      }
    }
  }
`;

export const GET_CLASSES_BY_NAME = gql`
  query GetClassesByName($nameInput: NameInput!) {
    classesByName(nameInput: $nameInput) {
      id
      name
      students {
        id
        name
      }
    }
  }
`;

export const GET_CLASS = gql`
  query GetClass($idInput: IdInput!) {
    class(idInput: $idInput) {
      id
      name
      students {
        id
        name
      }
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation CreateClass($createClassInput: CreateClassInput!) {
    createClass(createClassInput: $createClassInput) {
      id
      name
    }
  }
`;

export const UPDATE_CLASS = gql`
  mutation UpdateClass($updateClassInput: UpdateClassInput!) {
    updateClass(updateClassInput: $updateClassInput) {
      id
      name
    }
  }
`;

export const REMOVE_CLASS = gql`
  mutation RemoveClass($idInput: IdInput!) {
    removeClass(idInput: $idInput) {
      id
      name
    }
  }
`;
