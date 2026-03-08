import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Field, Input, Stack, Button } from "@chakra-ui/react"
import { LoginData } from '../models/AuthData'

type Props = {
    submitter: (data: LoginData) => void
}

const LoginForm: FC<Props> = ({ submitter }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()

    return (
        <Stack
            as="form"
            onSubmit={handleSubmit(data => submitter(data))}
            gap={6}
            maxW="400px"
            mx="auto"
            mt={10}
        >
            <Field.Root invalid={!!errors.email} required>
                <Field.Label>Email</Field.Label>
                <Input
                    type="email"
                    placeholder="name@example.com"
                    {...register("email", { required: true })}
                />
                <Field.ErrorText>Email is required</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password} required>
                <Field.Label>Password</Field.Label>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                />
                <Field.ErrorText>Password is required</Field.ErrorText>
            </Field.Root>

            <Button type="submit" colorPalette="teal" mt={4}>
                Login
            </Button>
        </Stack>
    )
}

export default LoginForm
