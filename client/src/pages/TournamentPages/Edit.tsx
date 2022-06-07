import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import { Tournament } from "../../models";
import { CompDates, StringDate } from "../../utils";
import Dropdown from "../../components/Dropdown";
import ErrorMessage from "../../components/ErrorMessage";
import Form from "../../components/Form";
import Input from "../../components/Input";
import DatePicker from "../../components/Input/DatePicker";
import FilePicker from "../../components/Input/FilePicker";
import { IMAGES } from "../../components/Input/FilePicker";
import Navbar from "../../components/Navbar";
import * as storage from "../../utils/storage";

export const Edit = () => {
  const [user, setUser] = useState(storage.getUserProfile());
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
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
  const { id } = useParams();

  useEffect(() => {
    if (errorMessage === undefined) return;
    const timer = setTimeout(() => setErrorMessage(undefined), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const updateTournament = async () => {
    if (id === undefined) return navigate("/");
    try {
      const res = await api.getTournament(id);
      let t = res.data as Tournament;
      setTournament(t);
      setFormData({
        name: t.name,
        discipline: t.discipline,
        organizer: t.organizer,
        creator: t.creator,
        startDate: t.startDate,
        applicationDeadline: t.applicationDeadline,
        location: t.location,
        participantsLimit: t.participantsLimit,
        sponsorsLogos: t.sponsorsLogos,
      });
    } catch (error) {
      api.errorData(error, navigate);
      navigate("/");
    }
  };

  useEffect(() => {
    updateTournament();
  }, []);

  if (user === null) return <Navigate to="/" />;

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
      await api.updateTournament(id!, formData);
      storage.setNextPage("edit");
      navigate("/post/edit");
    } catch (error) {
      let data = api.errorData(error, navigate, setErrorMessage);
      if (data?.unAuth) {
        storage.clearUserProfile();
        navigate(`/sign-in/_tournament_edit_${id}`);
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
      {tournament && (
        <div className="Content">
          <ErrorMessage err={errorMessage} />
          <Form submitText={`UPDATE`} cols={6} rows={5} submitCallback={submitHandler}>
            <Input
              name="Name"
              type="text"
              className="c3"
              min={3}
              required
              init={tournament.name}
              update={update("name")}
            />
            <Input
              name="Discipline"
              type="text"
              min={3}
              required
              init={tournament.discipline}
              update={update("discipline")}
            />
            <Input
              name="Organizer"
              type="text"
              className="c2"
              min={3}
              init={tournament.organizer}
              required
              update={update("organizer")}
            />
            <DatePicker
              name="Start date"
              className="c3"
              min={formData.applicationDeadline ? formData.applicationDeadline : undefined}
              init={StringDate(tournament.startDate)}
              required
              update={update("startDate")}
            />
            <DatePicker
              name="Application deadline date"
              className="c3"
              min={Date()}
              init={StringDate(tournament.applicationDeadline)}
              required
              update={update("applicationDeadline")}
            />
            <Input
              name="Location"
              type="url"
              className="c4"
              required
              init={tournament.location}
              regex="^https:\/\/www\.google\.com\/maps\/.*"
              update={update("location")}
            />
            <Input
              name="Participants limit"
              type="integer"
              min={2}
              className="c2"
              required
              init={tournament.participantsLimit?.toString()}
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
      )}
    </>
  );
};
