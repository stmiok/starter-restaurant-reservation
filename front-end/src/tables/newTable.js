import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import tableForm from "./tableForm";
import ErrorAlert from "../layout/ErrorAlert";

function newTable() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });
  const [err, setErr] = useState(false);

  const changeHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErr(false);
    const abortController = new AbortController();
    formData.capacity = Number(formData.capacity);
    try {
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
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
      <h1>New Table</h1>
      <ErrorAlert error={err} />
      <tableForm
        submitHandle={submitHandler}
        changeHandle={changeHandler}
        form={formData}
        cancelOption={cancelOption}
      />
    </div>
  );
}

export default newTable;
