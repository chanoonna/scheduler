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
    
    const wss = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    wss.onopen = function() {
      console.log("Web Socket opened");
      wss.send("ping");
    };

    wss.onmessage = function(res) {
      const appointment = JSON.parse(res.data);
      console.log('wss', appointment.interview)

      if (appointment.type === 'SET_INTERVIEW') {
        dispatch({ type: SET_INTERVIEW, id: appointment.id, interview: appointment.interview });

        return (() => wss.close());
      }

      console.log(res.data);
    }
    return (() => wss.close());
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {...state.appointments[id], interview})
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
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