import { Alert, Button,  Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
 
import { FC, useState } from "react";
import { LoginData } from "../models/AuthData";
interface Props {
  submitter: (loginData: LoginData) => Promise<string>;
}

const LoginForm: FC<Props> = ({submitter}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    resetField
  } = useForm<LoginData>();
const [errorMessage, setErrorMessage] = useState<string>("");
  const onSubmit = handleSubmit(async (data) => {
        const message = await submitter(data);
        if(message) {
            setErrorMessage(message);
        } 
  });
  return (
      <Stack gap="4" align="flex-start" maxW="sm" as="form" onSubmit={onSubmit} marginLeft={{
        base: 1,
        sm: 20,
        md: "80"
      }}>
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email", { required: true })} onFocus={() => {resetField("email"); setErrorMessage("")}}/>
          <Field.ErrorText>Email is required</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input {...register("password")} type="password" onFocus={() => {resetField("password"); setErrorMessage("")}}/>
          <Field.ErrorText>Password is required</Field.ErrorText>
        </Field.Root>

        <Button type="submit">Submit</Button>
        {!!errorMessage && <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>}
      </Stack>
    
  );
};
export default LoginForm;