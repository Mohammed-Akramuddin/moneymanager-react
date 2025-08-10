export const BASE_URL="https://moneymanager-api-jpzx.onrender.com"
// export const BASE_URL="http://localhost:8081/"
export const CLOUDNARY_CLOUD_NAME="dit1hyoaj"
export const API_ENDPOINTS={
    LOGIN:"/login",
    REGISTER:"/register",
    USER_INFO:"/profile",
    GET_ALL_CATEGORY:"/category",
    GET_ALL_INCOME_CATEGORY:"/category/income",
    GET_ALL_INCOMES:"/income",
    ADD_INCOME:"/income",
    INCOME_EXCEL:"/download/income",
    GET_ALL_EXPENSE_CATEGORY:"/category/expense",
    GET_ALL_EXPENSES:"/expense",
    ADD_EXPENSE:"/expense",
    EXPENSE_EXCEL:"/download/expense",
    APPLY_FILTER:"/filter",
    UPLOAD_IMAGE:`https://api.cloudinary.com/v1_1/${CLOUDNARY_CLOUD_NAME}/image/upload`
}