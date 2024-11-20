import React from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  Icon,
  Center,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaBook, FaUser } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";

export default function AdminDashboard() {
  const { isAdmin } = useAuth();

  const bgColor = "gray.100";
  const textColor = "gray.700";
  const cardHoverColor = "gray.200";

  if (!isAdmin) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="lg" color="red.500">
          You do not have permission to view this page.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={8} minH="100vh" bg="gray.50">
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" color={textColor}>
          🛠️ Admin Dashboard
        </Heading>
        <Text textAlign="center" color={textColor}>
          Welcome to the admin dashboard. Here you can manage books and authors.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{ bg: cardHoverColor, transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
          >
            <VStack align="stretch" spacing={4}>
              <Center>
                <Icon as={FaBook} boxSize={12} color="blue.500" />
              </Center>
              <Heading size="md" textAlign="center" color={textColor}>
                Manage Books
              </Heading>
              <Text textAlign="center" color={textColor}>
                Add, edit, or delete books in the system.
              </Text>
              <Button
                as={RouterLink}
                to="/admin/books"
                colorScheme="blue"
                size="lg"
                mt={4}
              >
                Go to Books
              </Button>
            </VStack>
          </Box>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{ bg: cardHoverColor, transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
          >
            <VStack align="stretch" spacing={4}>
              <Center>
                <Icon as={FaUser} boxSize={12} color="green.500" />
              </Center>
              <Heading size="md" textAlign="center" color={textColor}>
                Manage Authors
              </Heading>
              <Text textAlign="center" color={textColor}>
                Add, edit, or delete authors in the system.
              </Text>
              <Button
                as={RouterLink}
                to="/admin/authors"
                colorScheme="green"
                size="lg"
                mt={4}
              >
                Go to Authors
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
