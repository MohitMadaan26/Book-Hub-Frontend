import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "urql";
import { useAuth } from "../../utils/AuthContext";

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

const GET_AUTHORS = `
  query GetAuthors {
    getAuthors {
      _id
      name
    }
  }
`;

const CREATE_BOOK = `
  mutation CreateBook($title: String!, $authorId: String!, $publishedDate: DateTimeISO!, $genre: [String!]!, $summary: String!) {
    createBook(title: $title, authorId: $authorId, publishedDate: $publishedDate, genre: $genre, summary: $summary) {
      _id
    }
  }
`;

const UPDATE_BOOK = `
  mutation UpdateBook($id: String!, $title: String, $authorId: String, $publishedDate: DateTimeISO!, $genre: [String!], $summary: String) {
    updateBook(id: $id, title: $title, authorId: $authorId, publishedDate: $publishedDate, genre: $genre, summary: $summary) {
      _id
    }
  }
`;

export default function AdminBookForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAdmin } = useAuth();

  const [book, setBook] = useState({
    title: "",
    authorId: "",
    publishedDate: "",
    genre: [""],
    summary: "",
  });

  const [{ data: bookData }] = useQuery({
    query: GET_BOOK,
    variables: { id },
    pause: !id,
  });

  const [{ data: authorsData }] = useQuery({ query: GET_AUTHORS });

  const [, createBook] = useMutation(CREATE_BOOK);
  const [, updateBook] = useMutation(UPDATE_BOOK);

  useEffect(() => {
    if (bookData?.getBook) {
      setBook({
        title: bookData.getBook.title,
        authorId: bookData.getBook.author._id,
        publishedDate: new Date(bookData.getBook.publishedDate)
          .toISOString()
          .split("T")[0],
        genre: bookData.getBook.genre,
        summary: bookData.getBook.summary,
      });
    }
  }, [bookData]);

  if (!isAdmin) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="lg" color="red.500">
          You do not have permission to view this page.
        </Text>
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure publishedDate is in the correct ISO format
    const formattedPublishedDate = new Date(book.publishedDate).toISOString();

    const result = id
      ? await updateBook({ id, ...book, publishedDate: formattedPublishedDate })
      : await createBook({
          ...book,
          publishedDate: formattedPublishedDate,
        });

    if (result.error) {
      toast({
        title: `Error ${id ? "updating" : "creating"} book`,
        description: result.error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: `Book ${id ? "updated" : "created"} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/books");
    }
  };

  return (
    <Box p={8} maxW="lg" mx="auto" shadow="lg" rounded="lg">
      <Heading mb={6} textAlign="center" fontSize="3xl" fontWeight="bold">
        {id ? "Edit" : "Add"} Book
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              placeholder="Enter book title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Author</FormLabel>
            <Select
              value={book.authorId}
              onChange={(e) => setBook({ ...book, authorId: e.target.value })}
              placeholder="Select an author"
            >
              {authorsData?.getAuthors.map((author: any) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Published Date</FormLabel>
            <Input
              type="date"
              value={book.publishedDate}
              onChange={(e) =>
                setBook({ ...book, publishedDate: e.target.value })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Genre</FormLabel>
            <Input
              value={book.genre.join(", ")}
              onChange={(e) =>
                setBook({ ...book, genre: e.target.value.split(", ") })
              }
              placeholder="Enter genres separated by commas"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Summary</FormLabel>
            <Textarea
              value={book.summary}
              onChange={(e) => setBook({ ...book, summary: e.target.value })}
              placeholder="Enter book summary"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" width="full">
            {id ? "Update" : "Create"} Book
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
