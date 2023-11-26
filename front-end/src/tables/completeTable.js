import React, { useState } from "react";
import { finishTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


function completeTable({ table }) {
   const history = useHistory();
   const [err, setErr] = useState(false);
 

  const clickHandler = async (event) => {
    event.preventDefault();
    setErr(false);
    const abortController = new AbortController();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishTable(
          table.table_id,
          table.reservation_id,
          abortController.signal
        );
        history.push("/");
      } catch (error) {
        if (error.name !== "AbortError") {
          setErr(error);
        }
      }
      return () => {
        abortController.abort();
      };
    }
  };

  return (
    <div>
      <h6 data-table-id-status={table.table_id}>Occupied</h6>
      <ErrorAlert error={err} />
      <button
        type="button"
        data-table-id-finish={table.table_id}
        className="btn btn-primary"
        onClick={clickHandler}
      >
        Finish
      </button>
    </div>
  );
}

export default completeTable;