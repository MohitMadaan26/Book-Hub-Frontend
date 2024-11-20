import { useQuery } from "urql";

const GET_USER_QUERY = `
  query GetUser($userId: String!) {
    getUser(userId: $userId) {
      _id
      username
      email
      role
    }
  }
`;

export const useFetchUser = (userId: string) => {
  const [result] = useQuery({
    query: GET_USER_QUERY,
    variables: { userId },
  });
  //   console.log(result.data);
  return result;
};
