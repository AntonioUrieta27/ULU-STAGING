import React from "react";
import "./index.sass";
import { Spinner } from "@chakra-ui/react";

const index = () => {
  return (
    <div className="spinner">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </div>
  );
};

export default index;
