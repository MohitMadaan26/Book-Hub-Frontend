import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "urql";
import { useAuth } from "../../utils/AuthContext";

const GET_AUTHOR = `
  query GetAuthor($id: String!) {
    getAuthor(id: $id) {
      _id
      name
      birthdate
    }
  }
`;

const CREATE_AUTHOR = `
  mutation CreateAuthor($name: String!, $birthdate: DateTimeISO!) {
    createAuthor(name: $name, birthdate: $birthdate) {
      _id
    }
  }
`;

const UPDATE_AUTHOR = `
  mutation UpdateAuthor($id: String!, $name: String, $birthdate: DateTimeISO!) {
    updateAuthor(id: $id, name: $name, birthdate: $birthdate) {
      _id
    }
  }
`;

export default function AdminAuthorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAdmin } = useAuth();

  const [author, setAuthor] = useState({
    name: "",
    birthdate: "",
  });

  const [{ data: authorData }] = useQuery({
    query: GET_AUTHOR,
    variables: { id },
    pause: !id,
  });

  const [, createAuthor] = useMutation(CREATE_AUTHOR);
  const [, updateAuthor] = useMutation(UPDATE_AUTHOR);

  useEffect(() => {
    if (authorData?.getAuthor) {
      setAuthor({
        name: authorData.getAuthor.name,
        birthdate: new Date(authorData.getAuthor.birthdate)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [authorData]);

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

    const formattedBirthDate = new Date(author.birthdate).toISOString();

    const result = id
      ? await updateAuthor({
          id,
          name: author.name,
          birthdate: formattedBirthDate,
        })
      : await createAuthor({
          ...author,
          birthdate: formattedBirthDate,
        });

    if (result.error) {
      toast({
        title: `Error ${id ? "updating" : "creating"} author`,
        description: result.error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: `Author ${id ? "updated" : "created"} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/authors");
    }
  };

  return (
    <Box p={8} maxW="lg" mx="auto" shadow="lg" rounded="lg">
      <Heading mb={6} textAlign="center" fontSize="3xl" fontWeight="bold">
        {id ? "Edit" : "Add"} Author
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={author.name}
              onChange={(e) => setAuthor({ ...author, name: e.target.value })}
              placeholder="Enter author name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Birthdate</FormLabel>
            <Input
              type="date"
              value={author.birthdate}
              onChange={(e) =>
                setAuthor({ ...author, birthdate: e.target.value })
              }
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" width="full">
            {id ? "Update" : "Create"} Author
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
