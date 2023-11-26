/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import { json } from "react-router";
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a new reservation
 * @returns {Promise<{reservation}>}
 */

export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    heders,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, table);
}

/**
 * Retrieves existing tables
 * @returns {Promise<[tables]>}
 */

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Seat reservaion, updates reservaion status to seated and adds the reservation id to the table
 * @returns {Promise<{table}>}
 */

export async function seatTable(reservaion_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservaion_id: reservaion_id } }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * function for complete reservation, updates reservaion status to complete and delete the reservation id from the table
 * @returns {Promise<{table}>}
 */

export async function finishTable(reservaion_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: table_id }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
   Retrieves a single existing reservation.
   @returns {Promise<[reservation]>}
 */

export async function readReservation(reservaion_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservaion_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
   Updates the requested reservation
   @returns {Promise<[reservation]>}
 */

export async function udateReservation(reservation, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations/${reservation.reservaion_id}`
  );
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
   Changes status of reservation to "cancelled"
   @returns {Promise<[reservation]>}
 */

export async function cancelReservation(reservaion_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservaion_id}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "Cancelled" } }),
    signal,
  };
  return await fetchJson(url, options, {});
}
