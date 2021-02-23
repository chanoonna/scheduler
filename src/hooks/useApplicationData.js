import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer from "reducers/application";
import constants from 'helpers/constants';

const {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} = constants;

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
    
    // const wss = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // wss.onopen = function() {
    //   console.log("Web Socket opened");
    //   wss.send("ping");
    // };

    // wss.onmessage = function(res) {
    //   const appointment = JSON.parse(res.data);

    //   if (appointment.type === 'SET_INTERVIEW') {
    //     dispatch({ type: 'SET_INTERVIEW', id: appointment.id, interview: appointment.interview });
    //   }
    // }

    // return (() => wss.close());
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
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
