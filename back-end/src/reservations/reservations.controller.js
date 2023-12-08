const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

// List reservations
const list = async (req, res) => {
  const { date, mobile_number } = req.query;
  const data = date
    ? await reservationsService.listReservationsByDate(date)
    : await reservationsService.search(mobile_number);
  res.json({ data });
};

// Create reservation
const create = [
  hasProperties(...VALID_PROPERTIES),
  asyncErrorBoundary(async (req, res) => {
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
  }),
];

// Read reservation
const read = asyncErrorBoundary(async (req, res) => {
  res.status(200).json({ data: res.locals.reservation });
});

// Update reservation
const update = [
  asyncErrorBoundary(async (req, res) => {
    const updatedReservation = {
      ...req.body.data,
      reservation_id: res.locals.reservation.reservation_id,
    };
    const data = await reservationsService.updateStatus(updatedReservation);
    res.json({ data });
  }),
];

// Validate reservation status is booked when created
const validateBookedReservation = (req, res, next) => {
  const { status } = req.body.data;
  if (status && (status === "seated" || status === "finished")) {
    return next({
      status: 400,
      message: "Cannot create seated or finished reservation.",
    });
  }
  next();
};

// Additional validation functions...

module.exports = {
  list: asyncErrorBoundary(list),
  create,
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    validateStatus,
    validateFinishedReservation,
    ...update,
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasProperties(...VALID_PROPERTIES),
    validateBookedReservation,
    ...update,
  ],
};
