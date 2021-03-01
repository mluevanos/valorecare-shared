import * as Yup from "yup";

const venueValidationSchema = Yup.object().shape({
  name: Yup.string().min(2).required(),
  description: Yup.string().min(2).required(),
  url: Yup.string().min(2).required(),
});

export default venueValidationSchema;
