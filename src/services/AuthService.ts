import { LoginData, UserData } from "../models/AuthData";

export default interface AuthService {
    login(loginData: LoginData): Promise<UserData>;
    logout():Promise<void>
}