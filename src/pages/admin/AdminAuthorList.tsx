import React from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "urql";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Notiflix from "notiflix";

const GET_AUTHORS = `
  query GetAuthors {
    getAuthors {
      _id
      name
      birthdate
    }
  }
`;

const DELETE_AUTHOR = `
  mutation DeleteAuthor($id: String!) {
    deleteAuthor(id: $id)
  }
`;

export default function AdminAuthorList() {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [result, reexecuteQuery] = useQuery({ query: GET_AUTHORS });
  const [, deleteAuthor] = useMutation(DELETE_AUTHOR);

  const { data, fetching, error } = result;

  if (!isAdmin) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="lg" color="red.500">
          You do not have permission to view this page.
        </Text>
      </Box>
    );
  }

  if (fetching) {
    return (
      <Center height="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    toast({
      title: "Error fetching authors",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return null;
  }

  const confirmDelete = async (id: string) => {
    Notiflix.Confirm.show(
      "Delete Book",
      "Are you sure you want to delete this book?",
      "Delete",
      "Cancel",
      async function okCb() {
        const result = await deleteAuthor({ id });
        if (result.error) {
          toast({
            title: "Error deleting author",
            description: result.error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Author deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          reexecuteQuery({ requestPolicy: "network-only" });
        }
      },
      function cancelCb() {
        // console.log("Delete cancelled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading mb={6} textAlign="center" color="teal.500" fontSize="3xl">
        🛠️ Admin Author Management
      </Heading>

      <Button
        as={RouterLink}
        to="/admin/authors/add"
        colorScheme="green"
        mb={6}
        size="lg"
        boxShadow="md"
      >
        Add New Author
      </Button>

      <Box overflowX="auto" bg="white" p={6} borderRadius="md" boxShadow="lg">
        <Table variant="striped" colorScheme="green">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Birthdate</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getAuthors.map((author: any) => (
              <Tr key={author._id}>
                <Td>{author.name}</Td>
                <Td>{new Date(author.birthdate).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    as={RouterLink}
                    to={`/admin/authors/edit/${author._id}`}
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => confirmDelete(author._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
