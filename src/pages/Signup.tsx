import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Box,
  Heading,
  Flex,
  Image,
  Text,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "urql";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import registerImage from "../assets/register.png";

const REGISTER_MUTATION = `
  mutation($password: String!, $email: String!, $username: String!){
  register(password: $password, email: $email, username: $username) {
  username
  email
  }
}
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerResult, register] = useMutation(REGISTER_MUTATION);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (registerResult.error) {
      const errorMessage = registerResult.error.message
        .replace("[GraphQL]", "")
        .trim();

      toast({
        title: errorMessage,
        description: "Signup Failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [registerResult.error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Deriving the username from the email (part before @)
    const username = email.split("@")[0];
    const result = await register({ email, password, username });
    if (result.data?.register) {
      toast({
        title: "Signup successful",
        description: "Your account has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    }
  };

  if (registerResult.fetching)
    return (
      <Center height="100vh">
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Flex
      maxWidth="900px"
      margin="auto"
      mt={16}
      alignItems="center"
      justifyContent="space-between"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Box flex="1" textAlign="center">
        <Image
          src={registerImage}
          alt="Register Logo"
          boxSize={{ base: "250px", md: "350px", lg: "500px" }}
        />
      </Box>

      <Box
        flex="1"
        maxWidth="400px"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading mb={4} textAlign="center">
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mt="4">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button mt="6" type="submit" colorScheme="blue" width="full">
            Register
          </Button>
        </form>
        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Text as={RouterLink} to="/login" color="blue.500">
            Login here
          </Text>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;
