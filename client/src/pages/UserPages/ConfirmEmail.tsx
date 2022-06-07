import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Container from "../../components/Container";
import Text from "../../components/Text";
import * as storage from "../../utils/storage";

export const ConfirmEmail = () => {
  const [message, setMessage] = useState("\nClick here to confirm your email.");
  const [step, setStep] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  if (storage.isLoggedIn() || id === undefined) return <Navigate to="/" />;

  const retryConfirmation = async () => {
    try {
      await api.retryConfirm(id);
      navigate("/post-registration");
    } catch (error) {
      let data = api.errorData(error, navigate);

      setStep(3);
      setMessage(`Operation failed (Error: ${data?.message}).`);
    }
  };

  const confirm = async () => {
    try {
      await api.confirmEmail(id);
      storage.setNextPage("confirmation");
      navigate("/post/confirmation");
    } catch (error) {
      let data = api.errorData(error, navigate);

      if (data?.canRetry) {
        setStep(2);
        setMessage("\nConfirmation link expired.\n\nDo you want to have another link send to you now?");
      } else {
        setStep(3);
        setMessage("\nAccount with this email doesn't exist.");
      }
    }
  };

  return (
    <Container subtitle="Confirm your email" backContentBtn={step === 3}>
      <Text className="p-c">{message}</Text>
      {step !== 3 && (
        <div className="Container-controls">
          {step === 1 && (
            <button className="btn-solid" onClick={confirm}>
              CONFIRM
            </button>
          )}
          {step === 2 && (
            <>
              <button className="btn-solid" onClick={() => navigate("/")}>
                NO
              </button>
              <button className="btn-solid" onClick={retryConfirmation}>
                YES
              </button>
            </>
          )}
        </div>
      )}
    </Container>
  );
};
