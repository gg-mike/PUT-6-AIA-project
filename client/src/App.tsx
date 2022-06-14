import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";

import { Create, Edit, Single } from "./pages/TournamentPages";

import { ConfirmEmail, ForgotPassword, ResetPassword, SignIn, SignUp } from "./pages/UserPages";

import { NotFound, Post, ServerSideError, Test } from "./pages/Other";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/tournament/:id" element={<Single />} />
          <Route path="/tournament/create" element={<Create />} />
          <Route path="/tournament/edit/:id" element={<Edit />} />

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in/:nextParams" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/confirm-email/:id" element={<ConfirmEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:hash" element={<ResetPassword />} />

          <Route path="/post/:nextPage" element={<Post />} />
          <Route path="/server-side-error/:code" element={<ServerSideError />} />
          <Route path="/test" element={<Test />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
