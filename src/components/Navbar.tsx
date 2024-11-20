import React from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  useToast,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Navbar() {
  const { isAdmin, logout, username } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Box bg="gray.100" px={4} py={2} boxShadow="sm">
      <Flex alignItems="center">
        <Heading as="h1" size="lg" color="#2F5855">
          <Link to="/">BookHub Pro</Link>
        </Heading>
        {isAdmin && (
          <Button
            as={Link}
            to="/admin"
            ml={8}
            colorScheme="blue"
            bgGradient="linear(to-r, blue.400, teal.400)"
            _hover={{
              bgGradient: "linear(to-r, teal.400, blue.400)",
              transform: "scale(1.05)",
              boxShadow: "lg",
            }}
          >
            Admin
          </Button>
        )}
        <Spacer />
        <Flex alignItems="center">
          {localStorage.getItem("token") && (
            <>
              <Avatar size="sm" name={username} mr={2} />
              <Text fontWeight="bold" fontSize="lg" color="blue.600" mr={4}>
                {`Hi, ${username
                  .substring(0, 1)
                  .toUpperCase()
                  .concat(username.substring(1))}`}
              </Text>
            </>
          )}
          {/* Books and Authors buttons */}
          <Button as={Link} to="/books" mr={2} colorScheme="blue">
            Books
          </Button>
          <Button as={Link} to="/authors" mr={2} colorScheme="green">
            Authors
          </Button>
          {/* Conditionally render Logout button */}
          {localStorage.getItem("token") ? (
            <Button onClick={handleLogout} colorScheme="red">
              Logout
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" mr={2} colorScheme="purple">
                Login
              </Button>
              <Button as={Link} to="/register" colorScheme="teal">
                Register
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
