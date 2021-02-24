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
        
    // Commnet out WebSocket when runing tests
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    let tm = null;
    let interval = null;
    
    const ping = function() {
      ws.send('ping');
      tm = setTimeout(() => {
        console.log('Server is not responding');
        ws.close();
        clearInterval(interval);
      }, 5000);
    };

    const pong = function() {
      clearTimeout(tm);
    };

    ws.onopen = function() {
      console.log("Web Socket opened");
      interval = setInterval(ping, 30000);
    };

    ws.onmessage = function(res) {
      if (JSON.parse(res.data) === 'pong') {
        pong();
        return;
      }

      const appointment = JSON.parse(res.data);

      if (appointment.type === SET_INTERVIEW) {
        dispatch({ type: SET_INTERVIEW, id: appointment.id, interview: appointment.interview });
      }
    }

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  // Uncomment when running tests
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      // .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  // Uncomment when running tests
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      // .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
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
