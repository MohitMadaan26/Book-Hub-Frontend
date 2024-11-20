import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  return (
    <Container maxW="container.xl" py={10} w="100%" h="100vh">
      <VStack spacing={8} align="center" justify="center" height="100%">
        {/* Logo */}
        <Image
          src="https://r2.erweima.ai/imgcompressed/compressed_99e88ee33f08e9774804047193742a06.webp"
          alt="BookHub Pro Logo"
          boxSize="300px"
          borderRadius="full"
          shadow="0px 0px 20px 7px rgba(0, 0, 0, 0.50)"
          border="4px solid #38A169"
          objectFit="cover"
        />

        {/* Title */}
        <Heading as="h1" size="2xl" textAlign="center" color="teal.500">
          Welcome to BookHub Pro
        </Heading>

        {/* Description */}
        <Text fontSize="lg" textAlign="center" maxW="lg" color="gray.600">
          Your comprehensive book management system—crafted for avid readers and
          passionate book lovers.
        </Text>

        {/* Buttons */}
        <Box>
          <Button
            as={RouterLink}
            to="/books"
            colorScheme="blue"
            size="lg"
            mr={4}
            boxShadow="md"
            _hover={{ boxShadow: "xl" }}
            _active={{ bg: "blue.600", transform: "scale(0.98)" }}
          >
            Explore Books
          </Button>
          <Button
            as={RouterLink}
            to="/authors"
            colorScheme="green"
            size="lg"
            boxShadow="md"
            _hover={{ boxShadow: "xl" }}
            _active={{ bg: "green.600", transform: "scale(0.98)" }}
          >
            Discover Authors
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}
