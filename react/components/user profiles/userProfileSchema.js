import * as yup from "yup";

const userProfileSchema = yup.object().shape({
    userId: yup.number().required("Required"),
    firstName: yup.string().min(3, "First Name is too short").required("Required"),
    lastName: yup.string().min(3, "Last Name is too short").required("Required"),
    mi: yup.string(),
    avatarUrl: yup.string().required("Required"),
});

export {
    userProfileSchema
};