import { Box, Text } from '@chakra-ui/react'
import { useState } from 'react'
import LoginForm from '../LoginForm'
import authService from '../../services/AuthServiceImpl'
import { useUserData } from '../../services/hooks/useUserData'
import { LoginData } from '../../models/AuthData'

const LoginPage = () => {
    const { login } = useUserData()

    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleLogin = async (data: LoginData) => {
        try {
            // Звоним в Службу Безопасности
            const user = await authService.login(data)

            login(user)
            setErrorMsg(null)

        } catch (error) {
            setErrorMsg("Invalid credentials")
        }
    }

    return (
        <Box w="100%" maxW="500px" mx="auto" mt={10}>
            <Text fontSize="2xl" textAlign="center" fontWeight="bold" mb={6}>
                Login to System
            </Text>

            {errorMsg && (
                <Box bg="red.100" color="red.700" p={3} borderRadius="md" mb={4} textAlign="center" fontWeight="bold">
                    🚨 {errorMsg}
                </Box>
            )}

            {/* 5. Отдаем Менеджеру глупую анкету */}
            <LoginForm submitter={handleLogin} />
        </Box>
    )
}

export default LoginPage
