import React, { useState } from "react";
import { listReservations } from "../utils/api";
import showReservation from "./showReservation";
import ErrorAlert from "../layout/ErrorAlert";

function searchReservations() {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ mobile_number: "" });
  const [err, setErr] = useState(false);

  const changeHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErr(false);
    const abortController = new AbortController();
    try {
      const results = await listReservations(formData, abortController.signal);
      setReservations(results);
      setFormData({ mobile_number: "" });
    } catch (error) {
      if (error.name !== "AbortError") {
        setErr(error);
      }
    }
    return () => {
      abortController.abort();
    };
  };

  return (
    <main>
      <h1>Search Reservations</h1>
      <ErrorAlert error={err} />
      <section>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="mobile_number" class="form-label">
              Mobile Number:
            </label>
            <br />
            <input
              id="mobile_number"
              class="form-control"
              type="text"
              placeholder="Enter a customer's phone number"
              name="mobile_number"
              onChange={changeHandler}
              value={formData.mobile_number}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary m-3">
            Find
          </button>
        </form>
      </section>
      <hr />
      {reservations.length > 0 ? (
        <section>
          <h3>Search Results</h3>
          <showReservation reservations={reservations} />
        </section>
      ) : (
        "No reservations found"
      )}
    </main>
  );
}

export default searchReservations;
