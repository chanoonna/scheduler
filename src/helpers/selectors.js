export function getAppointmentsForDay(state, day) {
  const returnArr = [];
  const { days, appointments } = state;
  const selectedDay = days.filter(x => x.name === day);
  
  if (selectedDay.length === 0) {
    return [];
  }

  selectedDay[0].appointments.forEach(id => {
    returnArr.push(appointments[id]);
  });

  return returnArr;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const { interviewers } = state;
  const interviewer = interview.interviewer;

  return { 
    student: interview.student,
    interviewer: {
      ...interviewers[interviewer]
    },
  }
};

export function getInterviewersForDay(state, day) {
  const returnArr = [];
  const { days, interviewers } = state;
  const selectedDay = days.filter(x => x.name === day);

  if (selectedDay.length === 0) {
    return [];
  }

  selectedDay[0].interviewers.forEach(id => {
    returnArr.push(interviewers[id]);
  });

  return returnArr;
};

