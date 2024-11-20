import React, { useState } from "react";
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
  Spinner,
  Center,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery, useMutation } from "urql";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Notiflix from "notiflix";

const GET_BOOKS = `
  query GetBooks($page: Int!, $limit: Int!) {
    getBooks(page: $page, limit: $limit) {
      _id
      title
      author {
        name
      }
      publishedDate
    }
  }
`;

const DELETE_BOOK = `
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

export default function AdminBookList() {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const limit = 10;

  const [result, reexecuteQuery] = useQuery({
    query: GET_BOOKS,
    variables: { page, limit },
  });

  const [, deleteBook] = useMutation(DELETE_BOOK);

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
      title: "Error fetching books",
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
        const result = await deleteBook({ id });
        if (result.error) {
          toast({
            title: "Error deleting book",
            description: result.error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Book deleted",
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
        🛠️ Admin Book Management
      </Heading>

      <Button
        as={RouterLink}
        to="/admin/books/add"
        colorScheme="blue"
        mb={6}
        size="lg"
        boxShadow="md"
      >
        Add New Book
      </Button>

      <Box overflowX="auto" bg="white" p={6} borderRadius="md" boxShadow="lg">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Published Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getBooks.map((book: any) => (
              <Tr key={book._id}>
                <Td>{book.title}</Td>
                <Td>{book.author.name}</Td>
                <Td>{new Date(book.publishedDate).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    as={RouterLink}
                    to={`/admin/books/edit/${book._id}`}
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => confirmDelete(book._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box mt={6} textAlign="center">
        <IconButton
          icon={<FiChevronLeft />}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          isDisabled={page === 1}
          aria-label="Previous Page"
          size="lg"
          colorScheme="teal"
          mr={2}
        />
        <Text display="inline" fontSize="xl" fontWeight="bold">
          Page {page}
        </Text>
        <IconButton
          icon={<FiChevronRight />}
          onClick={() =>
            setPage((prev) =>
              data?.getBooks.length === limit ? prev + 1 : prev
            )
          }
          isDisabled={data?.getBooks.length < limit}
          aria-label="Next Page"
          size="lg"
          colorScheme="teal"
          ml={2}
        />
      </Box>
    </Box>
  );
}
