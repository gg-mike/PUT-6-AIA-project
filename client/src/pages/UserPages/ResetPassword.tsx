import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Container from "../../components/Container";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Text from "../../components/Text";
import * as storage from "../../utils/storage";

enum TYPE {
  LOADING = 1 << 1,
  EXPIRE = 1 << 2,
  INPUT = 1 << 3,
  SEND = 1 << 4,
}

export const ResetPassword = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [type, setType] = useState(TYPE.LOADING);
  const [formData, setFormData] = useState({ password: "", cP: "" });
  const navigate = useNavigate();
  const { id, hash } = useParams();

  useEffect(() => {
    if (storage.isLoggedIn() || id === undefined || hash === undefined) navigate("/");
    validateLink();
  }, []);

  const validateLink = async () => {
    setErrorMessage(undefined);
    try {
      await api.validateLink(id!, hash!);
      setType(TYPE.INPUT);
    } catch (error) {
      let data = api.errorData(error, navigate, setErrorMessage);
      if (data?.canRetry) setType(TYPE.EXPIRE);
      else navigate("/");
    }
  };

  const update = (name: string) => (value?: string) => {
    if (value) {
      setType(TYPE.INPUT);
      setFormData({ ...formData, [name]: value });
    }
  };

  const submitHandler = () => {
    if (formData.password !== formData.cP) return setErrorMessage("Passwords don't much");
    setType(TYPE.SEND);
  };

  const reset = async () => {
    setErrorMessage(undefined);
    try {
      await api.resetPassword({ id: id!, password: formData.password });
      navigate("/sign-in");
    } catch (error) {
      api.errorData(error, navigate);
      setErrorMessage("Operation failed");
    }
  };

  const noAction = () => {
    if (type === TYPE.EXPIRE) return navigate("/");
    if (type === TYPE.SEND) return setType(TYPE.INPUT);
  };

  const yesAction = () => {
    if (type === TYPE.EXPIRE) return navigate("/forgot-password");
    if (type === TYPE.SEND) return reset();
  };

  return (
    <Container subtitle="Reset password" error={errorMessage} loading={type === TYPE.LOADING}>
      <Form submitText={"RESET"} submitCallback={submitHandler} hideSubmit={Boolean(type & (TYPE.EXPIRE | TYPE.SEND))}>
        {type === TYPE.INPUT && (
          <>
            <Input name="Password" type="password" className="c2" min={8} required update={update("password")} />
            <Input name="Confirm password" type="password" className="c2" required update={update("cP")} />
          </>
        )}
        {Boolean(type & (TYPE.EXPIRE | TYPE.SEND)) && (
          <>
            <Text className="p-c c2">
              {type === TYPE.SEND
                ? `\nAre you sure you want to reset your password?\nThis operation is irreversible.`
                : `\nReset link expired. Do you want to have another link send to you now?`}
            </Text>
            <button className="btn-solid" onClick={noAction}>
              NO
            </button>
            <button className="btn-solid" onClick={yesAction}>
              YES
            </button>
          </>
        )}
      </Form>
    </Container>
  );
};
