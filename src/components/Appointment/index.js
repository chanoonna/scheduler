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
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';
const EDIT = 'EDIT';

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
    props.fn.bookInterview(props.appointment.id, interview, props.day)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function del(id) {
    transition(DELETE);
    props.fn.cancelInterview(id, props.day)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appoinment">
      { 
        props.id === "last"
          ? <Header time={props.time} />
          : <><Header time={props.time} />
              {mode === SAVE && <Status message="Saving..." />}
              {mode === DELETE && <Status message="Deleting..." />}
              {mode === ERROR_SAVE && <Error message="Error occured while Saving" onClose={back}/>}
              {mode === ERROR_DELETE && <Error message="Error occured while Deleting" onClose={back}/>}
              {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
              {mode === SHOW && (
                <Show
                  student={props.interview.student}
                  interviewer={props.interview.interviewer}
                  onEdit={() => transition(EDIT)}
                  onDelete={() => transition(CONFIRM)}
                />
              )}
              {mode === CONFIRM && (
                <Confirm
                  message="Do you want to delete the appintment?"
                  onCancel={() => back()}
                  onConfirm={() => del(props.appointment.id)}
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
              {mode === EDIT && (
                <Form
                  name={props.interview.student}
                  interviewer={props.interview.interviewer.id}
                  interviewers={props.interviewers}
                  onSave={save}
                  onCancel={back}
                  setInterviewer={props.setInterviewer}
                />
              )}
            </>
      }
    </article>
  );
};
