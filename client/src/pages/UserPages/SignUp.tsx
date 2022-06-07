import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as storage from "../../utils/storage";
import Form from "../../components/Form";
import Input from "../../components/Input";
import * as api from "../../api";
import Container from "../../components/Container";

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cP: "",
  });
  const navigate = useNavigate();

  if (storage.isLoggedIn()) return <Navigate to="/" />;

  const update = (name: string) => (value?: string) => value ? setFormData({ ...formData, [name]: value }) : undefined;

  const submitHandler = async () => {
    setErrorMessage(undefined);
    if (formData.password !== formData.cP) return setErrorMessage("Passwords don't much");

    try {
      await api.signUp(formData);
      storage.setNextPage("registration");
      navigate("/post/registration");
    } catch (error) {
      api.errorData(error, navigate, setErrorMessage);
    }
  };

  return (
    <Container subtitle={"Sign up"} error={errorMessage}>
      <Form submitText={"SIGN UP"} cols={2} submitCallback={submitHandler}>
        <Input name="First Name" min={3} required update={update("firstName")} />
        <Input name="Last Name" min={3} required update={update("lastName")} />
        <Input name="Email" type="email" className="c2" required update={update("email")} />
        <Input name="Password" type="password" className="c2" min={8} required update={update("password")} />
        <Input name="Confirm password" type="password" className="c2" required update={update("cP")} />
      </Form>
      <button className="Container-link btn-thin" onClick={() => navigate("/sign-in")}>
        Already have an account? Sign in
      </button>
    </Container>
  );
};
