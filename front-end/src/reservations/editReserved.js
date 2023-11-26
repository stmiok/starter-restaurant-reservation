import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import reservationForm from "./reservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function editReserved() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [err, setErr] = useState(false);

  useEffect(() => {
    async function getReservation() {
      const response = await readReservation(reservation_id);
      setReservation(response);
    }
    getReservation();
  }, [reservation_id]);

  const changeHandler = ({ target }) => {
    setReservation({ ...reservation, [target.name]: target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErr(false);
    const abortController = new AbortController();
    reservation.people = Number(reservation.people);
    try {
      const response = await updateReservation(
        reservation,
        abortController.signal
      );
      history.push(`/dashboard?date=${response.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setErr(error);
      }
    }
    return () => {
      abortController.abort();
    };
  };

  const cancelOption = () => history.goBack();

  return (
    <div>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={err} />
      <reservationForm
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        form={reservation}
        cancelOption={cancelOption}
      />
    </div>
  );
}

export default editReserved;
