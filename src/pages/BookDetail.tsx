import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "urql";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Spinner,
  Button,
  useColorModeValue,
  Divider,
  Center,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";

const GET_BOOK = `
  query GetBook($id: String!) {
    getBook(id: $id) {
      _id
      title
      author {
        _id
        name
      }
      publishedDate
      genre
      summary
    }
  }
`;

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [result] = useQuery({
    query: GET_BOOK,
    variables: { id },
  });

  const { data, fetching, error } = result;
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (error) {
    toast({
      title: "Error fetching books",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  if (fetching) {
    return (
      <Center height="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  const book = data?.getBook;

  if (!book) return <Text>Book not found</Text>;

  return (
    <Box maxWidth="800px" margin="auto" p={6}>
      <Button
        as={RouterLink}
        to="/books"
        leftIcon={<AiOutlineArrowLeft />}
        mb={6}
        bg="teal.500"
        color="white"
        _hover={{ bg: "teal.600" }}
        boxShadow="md"
      >
        Back to Books
      </Button>
      <VStack
        align="start"
        spacing={6}
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        border={`1px solid ${borderColor}`}
      >
        <Heading as="h1" size="2xl" color="teal.500">
          {book.title}
        </Heading>
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          By{" "}
          <Text as="span" color="blue.400">
            {book.author.name}
          </Text>
        </Text>
        <Text fontSize="md" color={textColor}>
          <strong>Published:</strong>{" "}
          {new Date(book.publishedDate).toLocaleDateString()}
        </Text>
        <HStack spacing={4} wrap="wrap">
          {book.genre.map((genre: string, index: number) => (
            <Tag
              key={index}
              size="lg"
              colorScheme="teal"
              px={4}
              py={2}
              fontWeight="bold"
              boxShadow="md"
            >
              {genre}
            </Tag>
          ))}
        </HStack>
        <Divider />
        <Box w="full">
          <Heading as="h2" size="lg" mb={3} color={textColor}>
            Summary
          </Heading>
          <Text fontSize="md" lineHeight="tall" color={textColor}>
            {book.summary}
          </Text>
        </Box>
      </VStack>
      <Box
        mt={1}
        p={1.5}
        bg="teal.500"
        color="white"
        borderRadius="md"
        textAlign="center"
        boxShadow="lg"
      ></Box>
    </Box>
  );
}
