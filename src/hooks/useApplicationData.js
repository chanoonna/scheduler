import { useState, useEffect } from 'react';
import axios from 'axios';
import { getDayIndex } from 'helpers/selectors';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(all => {
        setState(curr => (
          {
            ...curr,
            days: [...all[0].data],
            appointments: {...all[1].data},
            interviewers: {...all[2].data},
          }
        ));
      });
  }, []);

  function bookInterview(id, interview, day) {
    const dayIndex = getDayIndex(state, day);
    const selectedDay = {...state.days[dayIndex], spots: state.days[dayIndex].spots - 1};

    const days = state.days.reduce((accu, curr, index) => {
      if (index === dayIndex) {
        return accu.concat(selectedDay);
      }

      return accu.concat(curr);
    }, []);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => setState((curr) => ({ ...curr, days, appointments })));
  }

  function cancelInterview(id, day) {
    const dayIndex = getDayIndex(state, day);
    const selectedDay = {...state.days[dayIndex], spots: state.days[dayIndex].spots + 1};

    const days = state.days.reduce((accu, curr, index) => {
      if (index === dayIndex) {
        return accu.concat(selectedDay);
      }

      return accu.concat(curr);
    }, []);

    const appointments = {
      ...state.appointments
    };
    appointments[id].interview = null;

    return axios.delete(`/api/appointments/${id}`)
      .then(() => setState((curr) => ({ ...curr, days, appointments })))
  }

  const setDay = function(day) {
    setState({ ...state, day });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }
}

