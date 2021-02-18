import React from 'react';

import 'components/Application.scss';
import DayList from 'components/DayList';
import Appointment from 'components/Appointment/index';
import useApplicationData from 'hooks/useApplicationData';

import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from 'helpers/selectors';

export default function Application() {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

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
        day={state.day}
        fn={ {bookInterview, cancelInterview} }
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
