import { HStack } from "@chakra-ui/react";
import { Navigate, NavLink } from "react-router-dom";
import StatisticsSelector from "./StatisticsSelector";
import { ColorModeButton } from "./ui/color-mode";
import { useUserData } from "../state-management/auth-store";

const AppBar = () => {
  const { role, username } = useUserData();
  return (
    <HStack justifyContent={"space-evenly"}>
      {!!role && <NavLink to="/">Home</NavLink>}
      {role == "ADMIN" && <NavLink to="/add">Add Employee</NavLink>}
      {!!role && <StatisticsSelector></StatisticsSelector>}
      {!!role && <NavLink to="/logout">{username}</NavLink>}
      {!role && <NavLink to="/login">Login</NavLink>}
      {!role && <Navigate to="/login" />}
      <ColorModeButton></ColorModeButton>
    </HStack>
  );
};

export default AppBar;
