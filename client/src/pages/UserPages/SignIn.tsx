import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as storage from "../../utils/storage";
import Form from "../../components/Form";
import Input from "../../components/Input";
import * as api from "../../api";
import Container from "../../components/Container";

type SignInProps = {
  next?: string;
};

export const SignIn = ({ next }: SignInProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { nextParams } = useParams();
  const navigate = useNavigate();

  storage.clearNextPage();
  if (storage.isLoggedIn()) return <Navigate to="/" />;

  const update = (name: string) => (value?: string) => value ? setFormData({ ...formData, [name]: value }) : undefined;

  const submitHandler = async () => {
    setErrorMessage(undefined);

    try {
      let res = await api.signIn(formData);
      storage.setUserProfile(res.data as storage.UserProfile);
      if (nextParams) navigate(nextParams.replaceAll("_", "/"));
      else if (next) navigate(next);
      else navigate("/");
    } catch (error) {
      api.errorData(error, navigate, setErrorMessage);
    }
  };

  return (
    <Container subtitle={"Sign in"} error={errorMessage}>
      <Form submitText={"Sign in"} cols={2} submitCallback={submitHandler}>
        <Input name="Email" type="email" className="c2" required update={update("email")} />
        <Input name="Password" type="password" className="c2" min={8} required update={update("password")} />
      </Form>
      <button className="Container-link btn-thin" onClick={() => navigate("/forgot-password")}>
        Forgot password?
      </button>
      <button className="Container-link btn-thin" onClick={() => navigate("/sign-up")}>
        Don't have an account? Sign up
      </button>
    </Container>
  );
};
