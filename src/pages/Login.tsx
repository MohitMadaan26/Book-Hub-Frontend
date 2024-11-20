import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useMutation } from "urql";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import loginImage from "../assets/login.png";

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context

  const [loginResult, loginMutation] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await loginMutation({ email, password });
    if (result.data?.login) {
      login(result.data.login); // Update global state
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
        <img
          src={loginImage}
          alt="BookHub Pro Logo"
          style={{ maxWidth: "100%" }}
        />
      </Box>

      <Box
        flex="1"
        maxWidth="400px"
        p={8}
        boxShadow="lg"
        bg="white"
        borderRadius="md"
      >
        <Heading mb={4} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loginResult.fetching}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
