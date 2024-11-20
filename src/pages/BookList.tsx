import React, { useRef, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Input,
  Select,
  VStack,
  HStack,
  useToast,
  Spinner,
  Center,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useQuery } from "urql";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

const GET_BOOKS = `
  query GetBooks(
    $page: Int!,
    $limit: Int!,
    $sortBy: String!,
    $sortOrder: String!,
    $filterByGenre: [String!],
    $filterByAuthor: String!,
    $filterByDate: [String!]
    $searchByTitle: String!
  ) {
    getBooks(
      page: $page,
      limit: $limit,
      sortBy: $sortBy,
      sortOrder: $sortOrder,
      filterByGenre: $filterByGenre,
      filterByAuthor: $filterByAuthor,
      filterByDate: $filterByDate
      searchByTitle: $searchByTitle
    ) {
      _id
      title
      publishedDate
      genre
      summary
      author {
        name
      }
      addedBy  
    }
  }
`;

export default function BookList() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sortBy, setSortBy] = useState("publishedDate");
  const [searchTitle, setSearchTitle] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const toast = useToast();
  const genreInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [result] = useQuery({
    query: GET_BOOKS,
    variables: {
      page,
      limit,
      sortBy,
      sortOrder,
      filterByGenre: filterGenre.length > 0 ? [filterGenre] : undefined,
      filterByAuthor: filterAuthor,
      filterByDate: filterDate ? [filterDate] : undefined,
      searchByTitle: searchTitle || "",
    },
  });

  const { data, fetching, error } = result;

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

  const applyFilters = () => {
    setFilterGenre(genreInputRef.current?.value || "");
    setFilterAuthor(authorInputRef.current?.value || "");
    setSearchTitle(titleInputRef.current?.value || "");
  };

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
      <Heading mb={8} textAlign="center" color="teal.500" fontSize="3xl">
        📚 Explore Our Books Collection
      </Heading>

      {/* Filters Section */}
      <VStack
        spacing={4}
        align="stretch"
        mb={8}
        p={6}
        borderWidth="2px"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        transform="translateY(-10px)"
        _hover={{ transform: "translateY(0)", transition: "0.3s" }}
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          Filters
        </Text>
        <HStack spacing={4}>
          <Input
            placeholder="Search by title"
            ref={titleInputRef}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          />
          <Input
            placeholder="Filter by genre"
            ref={genreInputRef}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          />
          <Input
            placeholder="Filter by author"
            ref={authorInputRef}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          />
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          />
        </HStack>
        <HStack spacing={4}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          >
            <option value="publishedDate">Published Date</option>
            <option value="title">Title</option>
          </Select>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            bg="gray.100"
            _focus={{ bg: "gray.200", borderColor: "teal.400" }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </HStack>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              genreInputRef.current!.value = "";
              authorInputRef.current!.value = "";
              setFilterDate("");
              setFilterGenre("");
              setFilterAuthor("");
              setSearchTitle("");
            }}
          >
            Reset Filters
          </Button>
        </HStack>
      </VStack>

      {/* Books List */}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
        {data?.getBooks?.map((book: any) => (
          <Link to={`/books/${book._id}`} key={book._id}>
            <Box
              key={book._id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={6}
              boxShadow="2xl"
              bg="white"
              transition="0.3s"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "xl",
              }}
            >
              <Heading size="md" mb={2} color="teal.400">
                <Link to={`/books/${book._id}`}>{book.title}</Link>
              </Heading>
              <Text color="gray.600">Author : {book.author.name}</Text>
              <Text color="gray.500" fontSize="sm">
                Published Date :{" "}
                {new Date(book.publishedDate).toLocaleDateString()}
              </Text>
              <Badge colorScheme="purple" mt={2}>
                {book.genre.join(", ")}
              </Badge>
              <Text noOfLines={2} mt={2} fontStyle="italic" color="gray.700">
                {`Summary - ${book.summary}`}
              </Text>
              <Badge colorScheme="blue" mt={2}>
                {`added by - ${book.addedBy}`}
              </Badge>
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      {/* Pagination */}
      <HStack justifyContent="center" mt={10}>
        <IconButton
          icon={<FiChevronLeft />}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          isDisabled={page === 1}
          aria-label="Previous Page"
          size="lg"
          colorScheme="teal"
        />
        <Text fontWeight="bold" fontSize="xl">
          Page {page}
        </Text>
        <IconButton
          icon={<FiChevronRight />}
          onClick={() =>
            setPage((prev) =>
              data?.getBooks?.length === limit ? prev + 1 : prev
            )
          }
          isDisabled={data?.getBooks?.length < limit}
          aria-label="Next Page"
          size="lg"
          colorScheme="teal"
        />
      </HStack>
    </Box>
  );
}
