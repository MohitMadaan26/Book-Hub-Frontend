import React from "react";
import { Box, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import notfoundImage from "../assets/404 not found.png";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Image
        src={notfoundImage}
        alt="404 Illustration"
        mb={6}
        boxSize="300px"
        w="30%"
      />
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, blue.500)"
        bgClip="text"
      >
        404
      </Heading>
      <Text fontSize="xl" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color="gray.500" mb={6}>
        The page you are looking for does not seem to exist.
      </Text>
      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, blue.500)"
        color="white"
        variant="solid"
        onClick={goToHome}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
