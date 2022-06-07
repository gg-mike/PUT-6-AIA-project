import { Navigate, useParams } from "react-router";
import Container from "../../components/Container";
import Text from "../../components/Text";

export const ServerSideError = () => {
  const { code } = useParams();
  if (!code) return <Navigate to="/" />;

  return (
    <Container subtitle="Server side error" backContentBtn>
      <Text>{`\nError on the server side detected. Please contact the technical support for help.\n\nError code: ${code}`}</Text>
    </Container>
  );
};
