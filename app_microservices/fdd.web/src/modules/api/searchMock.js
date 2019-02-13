import moment from 'moment';

const searchMock = (origin, destination, date) => ([
  {
    "id": "f1",
    "carrier": "AF",
    "flightNumber": "20",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: <15 min delay (no payout)"
  },
  {
    "id": "f2",
    "carrier": "AF",
    "flightNumber": "21",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: > 15 <= 30min. delay",
  },
  {
    "id": "f3",
    "carrier": "AF",
    "flightNumber": "22",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: > 30 <= 45 delay"
  },
  {
    "id": "f4",
    "carrier": "AF",
    "flightNumber": "23",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: > 45min. delay"
  },
  {
    "id": "f5",
    "carrier": "AF",
    "flightNumber": "24",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: cancelled"
  },
  {
    "id": "f6",
    "carrier": "AF",
    "flightNumber": "25",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: diverted"
  },
  {
    "id": "f7",
    "carrier": "AF",
    "flightNumber": "26",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: never landing, should go on manual payout"
  },
  {
    "id": "f8",
    "carrier": "AF",
    "flightNumber": "27",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: invalid status from oracle"
  },
  {
    "id": "f9",
    "carrier": "AF",
    "flightNumber": "30",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: empty result from oracle"
  },
  {
    "id": "f10",
    "carrier": "AF",
    "flightNumber": "31",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: invalid result from oracle"
  },
  {
    "id": "f11",
    "carrier": "AF",
    "flightNumber": "32",
    "origin": origin,
    "destination": destination,
    "arrivalTime": moment(date).add(1, 'day').format('YYYY-MM-DDTHH:MM:SSZ'),
    "departureTime": moment(date).format('YYYY-MM-DDTHH:MM:SSZ'),
    "description": "Test case: too few observations"
  },
]);

export default searchMock;
