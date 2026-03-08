import { AxiosError } from "axios";
import { LoginData, UserData } from "../models/AuthData";
import AuthService from "./AuthService";
const DUMMY_LOGIN_USERS: any = {
    "user@tel-ran.com": {
        username: "user",
        password: "user1234",
        role: "USER"
    },
    "admin@tel-ran.com": {
        username: "admin",
        password: "admin1234",
        role: "ADMIN"
    }
}
class AuthServiceDummy implements AuthService {
    async login(loginData: LoginData): Promise<UserData> {
        const userData = DUMMY_LOGIN_USERS[loginData.email]
        if (!userData || userData.password !== loginData.password) {
            throw new AxiosError("Invalid credentials")
        }
        return {username: userData.username, role: userData.role}

    }
    logout(): Promise<void> {
        return Promise.resolve()
    }
    
}
const authService = new AuthServiceDummy()
export default authService