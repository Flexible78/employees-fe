#  Authentication and Authorization Flows
## Zustand Global State management
### UserDataStrore should be global state
### Create useUserData hook for managing UserData state
## Login page
### Login form
#### Inputting the user credentials (email and password)
#### Showing Alert (see Chakra UI Alert examples) in the case of invalid user credentials (think based on the common sense of LoginForm)
### Updating global user data state according to integration with LoginForm and AuthService
## Logout page
### Button with action of updating user data global state
## Updating routes with consideration LoginPage  and LogoutPage
## Updating AppBar component in accordance with the following rules
### Showing only "Login" item in the case of no user data exist
### Showing Home, Statistics, Logout items in the case of user data contain the user with role "USER"
### Showing Home, Add Employee, Statistics, Logout items in the case of user data contain the user with role "ADMIN"
