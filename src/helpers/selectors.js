export default function getAppointmentsForDay(state, day) {
  const returnArr = [];
  const { days, appointments } = state;
  const selectedDay = days.filter(x => x.name === day);
  
  if (selectedDay.length === 0) {
    return [];
  }

  selectedDay[0].appointments.forEach(id => {
    returnArr.push(appointments[id])
  });

  return returnArr;
};