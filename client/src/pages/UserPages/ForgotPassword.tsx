import { useState } from "react";
import { useNavigate } from "react-router";
import * as api from "../../api";
import Container from "../../components/Container";
import Form from "../../components/Form";
import Input from "../../components/Input";
import * as storage from "../../utils/storage";

export const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submitHandler = async () => {
    setErrorMessage(undefined);
    try {
      await api.forgotPassword(email);
      storage.setNextPage("forgot-password");
      navigate("/post/forgot-password");
    } catch (error) {
      api.errorData(error, navigate, setErrorMessage);
    }
  };

  return (
    <Container subtitle="Forgot password" error={errorMessage}>
      <Form submitText={"SEND RESET MAIL"} cols={1} submitCallback={submitHandler}>
        <Input
          name="Email"
          type="email"
          className="c2"
          min={8}
          required
          update={(data?: string) => {
            if (data) setEmail(data);
          }}
        />
      </Form>
    </Container>
  );
};
