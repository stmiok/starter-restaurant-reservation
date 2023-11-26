import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useRouteMatch } from "react-router-dom";
import showTable from "../tables/showTable";
import showReservation from "..reservations/showReservation";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    function getDate() {
      const fetchDate = query.get("date");
      if (fetchDate) {
        setCurrentDate(fetchDate);
      } else {
        setCurrentDate(today());
      }
    }
    fetchDate();
  }, [query, route]);

  useEffect(loadDashboard, [currentDate]);

  return (
    <main>
    <h1>Dashboard</h1>
    <div className="d-md-flex mb-3">
      <h4 className="mb-0">Reservations for date</h4>
    </div>
    <ErrorAlert error={reservationsError} />
    <div className="d-grid gap-2 d-md-flex justify-content-center">
      <button
        type="button"
        className="btn btn-outline-primary mx-2 my-2"
        onClick={() => {
          history.push(`/dashboard?date=${previous(currentDate)}`);
          setCurrentDate(previous(currentDate));
        }}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-outline-primary mx-2 my-2"
        onClick={() => {
          history.push(`/dashboard?date=${today()}`);
          setCurrentDate(today());
        }}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-outline-primary mx-2 my-2"
        onClick={() => {
          history.push(`/dashboard?date=${next(currentDate)}`);
          setCurrentDate(next(currentDate));
        }}
      >
        Next
      </button>
    </div>
    <br />
    <ShowReservations reservations={reservations} />
    <hr />
    <div className="d-md-flex mb-3">
      <h4 className="mb-0">Tables</h4>
    </div>
    <ShowTables tables={tables} />
  </main>
);
}

export default Dashboard;
