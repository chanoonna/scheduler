import { useReducer, useEffect } from 'react';
import axios from 'axios';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

export default function useApplicationData() {
  const [state, dispatch] = useReducer(
    reducer,
    {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {},
    }
  );

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(all => {
        dispatch(
          {
            type: SET_APPLICATION_DATA,
            days: [...all[0].data],
            appointments: {...all[1].data},
            interviewers: {...all[2].data},
          }
        );
      });
  }, []);

  function bookInterview(id, interview, day) {
    return axios.put(`/api/appointments/${id}`, {...state.appointments[id], interview})
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview, day, value: -1 }));
  }

  function cancelInterview(id, day) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null, day, value: 1 }));
  }

  function setDay(day) {
    dispatch({ type: SET_DAY, day });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };

    case SET_INTERVIEW:
      const days = changeSpots(state.days, action.day, action.value);

      return {
        ...state,
        days,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: { ...action.interview },
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

function changeSpots(days, target, value) {
  return days.map(day => {
    if (day.name === target) {
      return {...day, spots: day.spots + value};
    }

    return day;
  });
}