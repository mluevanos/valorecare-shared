import * as Yup from "yup";

const noteValidationSchema = Yup.object().shape({
  notes: Yup.string().max(10000, "Please insert 6000 characters or less"),
  seekerId: Yup.number().required("Required"),
  tagId: Yup.number(),
});

export default noteValidationSchema;
