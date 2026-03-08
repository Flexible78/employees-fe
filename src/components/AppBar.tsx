import { HStack, Button } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import StatisticsSelector from './StatisticsSelector'
import { ColorModeButton } from './ui/color-mode'
import { useUserData } from '../services/hooks/useUserData'

const AppBar = () => {
    const { userData, logout } = useUserData()

    return (
        <HStack justifyContent={"space-evenly"} p={4} bg="gray.100" _dark={{ bg: "gray.800" }}>

            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                Home
            </NavLink>

            {userData?.role === 'ADMIN' && (
                <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
                    Add Employee
                </NavLink>
            )}

            <StatisticsSelector></StatisticsSelector>

            <Button colorPalette="red" variant="outline" size="sm" onClick={logout}>
                Logout ({userData?.email})
            </Button>

            <ColorModeButton></ColorModeButton>
        </HStack>
    )
}

export default AppBar
