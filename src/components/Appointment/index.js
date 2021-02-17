import React from 'react';

import useVisualMode from 'hooks/useVisualMode';
import Show from 'components/Appointment/Show';
import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

import 'components/Appointment/styles.scss';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVE = 'SAVE';
const DELETE = 'DELETE';
const CONFIRM = 'CONFIRM';
const ERROR = 'ERROR';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    props.fn.bookInterview(props.appointment.id, interview)
      .then(() => transition(SHOW));
  }

  function del(id) {
    transition(DELETE);
    props.fn.delInterview(id)
      .then(() => transition(EMPTY));
  }

  return (
    <article className="appoinment">
      { 
        props.id === "last"
          ? <Header time={props.time} />
          : <><Header time={props.time} />
              {mode === SAVE && <Status message="Saving..." />}
              {mode === DELETE && <Status message="Deleting..." />}
              {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
              {mode === SHOW && (
                <Show
                  student={props.interview.student}
                  interviewer={props.interview.interviewer}
                  onDelete={() => transition(CONFIRM)}
                />
              )}
              {mode === CREATE && (
                <Form
                  interviewers={props.interviewers}
                  onSave={save}
                  onCancel={() => back()}
                  setInterviewer={props.setInterviewer}  
                />
              )}
              {mode === CONFIRM && (
                <Confirm
                  message="Do you want to delete the appintment?"
                  onCancel={() => back()}
                  onConfirm={() => del(props.appointment.id)}
                />
              )}
            </>
      }
    </article>
  );
};
