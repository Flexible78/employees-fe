import { HStack } from "@chakra-ui/react"
import { NavLink } from "react-router-dom"
import StatisticsSelector from "./StatisticsSelector"
import { ColorModeButton } from "./ui/color-mode"

const AppBar = () => {
  return (
    <HStack justifyContent={"space-evenly"}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/add">Add Employee</NavLink>
     <StatisticsSelector></StatisticsSelector>
     <ColorModeButton></ColorModeButton>
      
   </HStack>
  )
}

export default AppBar
