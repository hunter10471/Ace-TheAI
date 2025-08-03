import * as Yup from "yup";

export const SignupValidationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must contain one uppercase letter, one number, and one special character"
        )
        .required("Password is required"),
    "confirm-password": Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm password is required"),
});

export const LoginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export const ChangePasswordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must contain one uppercase letter, one number, and one special character"
        )
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
        .required("Confirm password is required"),
});
