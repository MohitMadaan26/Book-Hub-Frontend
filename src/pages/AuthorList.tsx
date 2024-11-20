import React from "react";
import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useToast,
  Tooltip,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useQuery } from "urql";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const GET_AUTHORS = `
  query GetAuthors {
    getAuthors {
      _id
      name
      birthdate
      books {
        _id
        title
      }
    }
  }
`;

export default function AuthorList() {
  const [result] = useQuery({ query: GET_AUTHORS });
  const { data, fetching, error } = result;

  const toast = useToast();

  // Loading state with spinner
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
      duration: 9000,
      isClosable: true,
    });
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <IconButton
        aria-label="Reload"
        icon={<FiRefreshCw />}
        onClick={() => window.location.reload()}
        colorScheme="teal"
        variant="solid"
        size="md"
        _hover={{ bg: "teal.600" }}
        title="Reload Page"
      />
      <Heading mb={6} color="teal.500" textAlign="center">
        ✍️ Authors List
      </Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
        {data?.getAuthors.map((author: any) => (
          <Box
            key={author._id}
            borderWidth={1}
            borderRadius="lg"
            p={4}
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="all 0.3s ease"
            bg="white"
          >
            <Heading size="md" mb={2} color="blue.600">
              {author.name}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Born: {new Date(author.birthdate).toLocaleDateString()}
            </Text>
            <VStack align="start" mt={4}>
              <Text fontWeight="bold" color="teal.600">
                Books:
              </Text>
              {author.books.map((book: any) => (
                <Tooltip label="Click to view details" hasArrow key={book._id}>
                  <Button
                    as={Link}
                    to={`/books/${book._id}`}
                    variant="link"
                    color="blue.500"
                    _hover={{
                      textDecoration: "underline",
                      color: "blue.700",
                    }}
                    leftIcon={<FaBookOpen />}
                    w="full"
                    size="sm"
                    justifyContent="start"
                    mt={2}
                  >
                    {book.title}
                  </Button>
                </Tooltip>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
