import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AppBar from "../AppBar";

const LayoutPage = () => {
  return (
    <>
      <AppBar />
      <Box marginTop={"4vh"}>
        <Outlet></Outlet>
      </Box>
    </>
  );
};

export default LayoutPage;
