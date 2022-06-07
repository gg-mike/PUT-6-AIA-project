import { Navigate, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/Container";
import Text from "../../components/Text";
import * as storage from "../../utils/storage";
import data from "../../data/post.json";

interface PostData {
  key: string;
  info: string;
  className?: string;
  navAction?: string;
  actionName?: string;
}

export const Post = () => {
  const { nextPage } = useParams();
  const navigate = useNavigate();

  if (!storage.getNextPage() || storage.getNextPage() !== nextPage) return <Navigate to="/" />;

  const config = (data as [PostData]).filter((elem) => elem.key === nextPage)[0];

  return (
    <Container backContentBtn={!config.navAction}>
      <Text className={config.className ? config.className : ""}>
        {`\n`}
        {config.info}
      </Text>
      {config.navAction && (
        <button
          className="btn-solid"
          style={{ width: "100%", marginTop: "1em" }}
          onClick={() => navigate(config.navAction!)}
        >
          {config.actionName}
        </button>
      )}
    </Container>
  );
};
