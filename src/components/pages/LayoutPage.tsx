import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import AppBar from '../AppBar'
import LoginPage from './LoginPage' // 👈 Зовем нашего Менеджера с анкетами
import { useUserData } from '../../services/hooks/useUserData' // 👈 Берем планшет

const LayoutPage = () => {
    const { userData } = useUserData()

    if (!userData) {
        return <LoginPage />
    }

    return (
        <>
            <AppBar />
            <Box p={4}>
                <Outlet />
            </Box>
        </>
    )
}

export default LayoutPage
