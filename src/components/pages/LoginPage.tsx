import { FC, useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginData } from "../../models/AuthData";
import authService from "../../services/AuthServiceImpl";
import { AxiosError } from "axios";
import { useUserData } from "../../state-management/auth-store";
import LoginForm from "../LoginForm";

const LoginPage: FC = () => {
  const setUserData = useUserData((s) => s.setUserData);
  const [isHomeNavigate, setHomeNavigate] = useState<boolean>(false);
  const submitter = async (loginData: LoginData): Promise<string> => {
    let errorMessage = "";
    try {
      const userData = await authService.login(loginData);
      setUserData(userData);
      setHomeNavigate(true);
    } catch (error) {
      errorMessage = (error as AxiosError).message;
    }
    return errorMessage;
  };
  return (
    <>
      {isHomeNavigate && <Navigate to="/" />}
      <LoginForm submitter={submitter} />
    </>
  );
};

export default LoginPage;
