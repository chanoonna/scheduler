import constants from 'helpers/constants';

const {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} = constants;

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };

    case SET_INTERVIEW:
      const days = changeSpots(state, action.id, action.interview);
      const interview = action.interview ? { ...action.interview } : null;

      return {
        ...state,
        days,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview,
          }
        } 
      };

    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: [...action.days],
        appointments: {...action.appointments},
        interviewers: {...action.interviewers},
      };

    
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

function changeSpots(state, id, interview) {
  const value = interview ? -1 : 1;
  const targetDay = state.days.filter(x => x.appointments.includes(id))[0].spots += value;

  return state.days.map(day => {
    if (day.name === targetDay.name) {
      return targetDay;
    }

    return day;
  });
}