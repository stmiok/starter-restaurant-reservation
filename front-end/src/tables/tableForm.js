import React from "react";

function tableForm({ submitHandler, changeHandler, form, cancelClick }) {
  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="table_name" class="form-label">
          Table Name
        </label>
        <br />
        <input
          id="table_name"
          class="form-control"
          type="text"
          placeholder="Table Name"
          name="table_name"
          onChange={changeHandler}
          value={form.table_name}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity" class="form-label">
          Table Capacity
        </label>
        <br />
        <input
          id="capacity"
          class="form-control"
          type="number"
          min={1}
          placeholder={1}
          name="capacity"
          onChange={changeHandler}
          value={form.capacity}
          required
        />
      </div>
      <button onClick={cancelClick} className="btn btn-secondary">
        Cancel
      </button>
      <button type="submit" className="btn btn-primary m-3">
        Submit
      </button>
    </form>
  );
}

export default tableForm;