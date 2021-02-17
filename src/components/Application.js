import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from 'components/DayList';
import Appointment from 'components/Appointment/index';

import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from 'helpers/selectors';

export default function Application() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => setState((curr) => ({ ...curr, appointments })));
  }

  function delInterview(id) {
    const appointments = {
      ...state.appointments
    };
    appointments[id].interview = null;

    return axios.delete(`/api/appointments/${id}`)
      .then(() => setState((curr) => ({ ...curr, appointments })))
  }

  const setDay = function(day) {
    setState({ ...state, day });
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(all => {
        setState(prev => (
          {
            ...prev,
            days: [...all[0].data],
            appointments: {...all[1].data},
            interviewers: {...all[2].data},
          }
        ));
      });
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map(appointment => {
    const interviewers = getInterviewersForDay(state, state.day);
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        time={appointment.time}
        appointment={appointment}
        interviewers={interviewers}
        interview={interview}
        fn={ {bookInterview, delInterview} }
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment id="last" time="5pm" />
      </section>
    </main>
  );
}
