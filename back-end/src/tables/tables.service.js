const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex("tables").where({ table_id: table_id }).first();
}

// function update(table_id, reservation_id) {
//   return knex
//     .transaction(async (transaction) => {
//       await knex("reservations")
//         .where({ reservation_id })
//         .update({ status: "seated" })
//         .transacting(transaction);

//       return knex("tables")
//         .where({ table_id })
//         .update({ reservation_id }, "*")
//         .transacting(transaction)
//         .then((records) => records[0]);
//     })
//     .catch((error) => {
//       console.error(error);
//       throw error;
//     });
// }

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

// function finish(table) {
//   return knex.transaction(async (transaction) => {
//     await knex("reservations")
//       .where({ reservation_id: table.reservation_id })
//       .update({ status: "finished" })
//       .transacting(transaction);

//     return knex("tables")
//       .where({ table_id: table.table_id })
//       .update({ reservation_id: null }, "*")
//       .transacting(transaction)
//       .then((records) => records[0]);
//   });
// }

function destroy(table_id, reservation_id) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id: table_id })
      .update({ reservation_id: null })
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "finished" });
      });
  });
}

module.exports = {
  list,
  create,
  read,
  update,
  // finish,
  destroy,
};
