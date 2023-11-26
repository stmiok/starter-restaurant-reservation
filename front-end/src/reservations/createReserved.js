import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import reservationForm from "./reservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function createReserved() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    party_size: "",
  });
  const [err, serErr] = useState(false);
  const history = useHistory();

  const changeHandler = ({ target }) => {
    setFormData({ ...forData, [target.name]: target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErr(false);
    const abortController = new AbortController();
    formData.party_size = Number(formData.party_size);
    try {
      const response = await createReserved(formData, abortController.signal);
      history.push(`/dashboard?date=${response.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        serErr(error);
      }
    }
    return () => {
      abortController.abort();
    };
  };

  const cancelClick = () => history.push(`/dashboard`);

  return (
    <div>
      <h1>New Reservation</h1>
      <ErrorAlert error={err} />
      <reservationForm
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        form={formData}
        cancelClick={cancelClick}
      />
    </div>
  );
}
