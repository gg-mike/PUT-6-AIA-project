import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../../api";
import Dropdown from "../../components/Dropdown";
import ErrorMessage from "../../components/ErrorMessage";
import Form from "../../components/Form";
import Input from "../../components/Input";
import DatePicker from "../../components/Input/DatePicker";
import FilePicker from "../../components/Input/FilePicker";
import { IMAGES } from "../../components/Input/FilePicker";
import Navbar from "../../components/Navbar";
import { CompDates } from "../../utils";
import * as storage from "../../utils/storage";

export const Create = () => {
  const [user, setUser] = useState(storage.getUserProfile());
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    name: "",
    discipline: "",
    organizer: "",
    creator: user ? user._id : "",
    startDate: "",
    applicationDeadline: "",
    location: "",
    participantsLimit: 0,
    sponsorsLogos: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage === undefined) return;
    const timer = setTimeout(() => setErrorMessage(undefined), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (user === null) return <Navigate to="/sign-in/_tournament_create" />;

  const update = (name: string) => (value?: string) => {
    if (value && name !== "participantsLimit") setFormData({ ...formData, [name]: value });
    else if (value && name === "participantsLimit") setFormData({ ...formData, [name]: Number(value) });
  };

  const logoutHandler = () => {
    storage.clearUserProfile();
    setUser(null);
  };

  const submitHandler = async () => {
    if (CompDates(formData.startDate, formData.applicationDeadline) === -1)
      return setErrorMessage("Application deadline date should be before start date");

    try {
      await api.createTournament(formData);
      storage.setNextPage("creation");
      navigate("/post/creation");
    } catch (error) {
      let data = api.errorData(error, navigate, setErrorMessage);
      if (data?.unAuth) {
        storage.clearUserProfile();
        navigate("/sign-in/_tournament_create");
      }
    }
  };

  return (
    <>
      <Navbar>
        {user && (
          <Dropdown className="Navbar-action" mainElement={<button className="btn-solid">{user.name}</button>}>
            <button className="btn-solid" onClick={logoutHandler}>
              LOGOUT
            </button>
          </Dropdown>
        )}
      </Navbar>
      <div className="Content">
        <ErrorMessage err={errorMessage} />
        <Form submitText={`CREATE`} cols={6} rows={5} submitCallback={submitHandler}>
          <Input name="Name" type="text" className="c3" min={3} required update={update("name")} />
          <Input name="Discipline" type="text" min={3} required update={update("discipline")} />
          <Input
            name="Organizer"
            type="text"
            className="c2"
            min={3}
            init={user.name}
            required
            update={update("organizer")}
          />
          <DatePicker
            name="Start date"
            className="c3"
            min={formData.applicationDeadline ? formData.applicationDeadline : undefined}
            required
            update={update("startDate")}
          />
          <DatePicker
            name="Application deadline date"
            className="c3"
            min={Date()}
            required
            update={update("applicationDeadline")}
          />
          <Input
            name="Location"
            type="url"
            className="c4"
            required
            regex="^https:\/\/www\.google\.com\/maps\/.*"
            update={update("location")}
          />
          <Input
            name="Participants limit"
            type="integer"
            min={2}
            className="c2"
            required
            update={update("participantsLimit")}
          />
          <FilePicker
            name="Sponsors logos"
            className="c6"
            fileType={IMAGES}
            required
            update={update("sponsorsLogos")}
          />
        </Form>
      </div>
    </>
  );
};
