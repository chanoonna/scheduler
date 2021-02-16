import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import "index.scss";

import Button from "components/Button";
import DayListItem from 'components/DayListItem';
import DayList from "components/DayList";
import InterviewerListItem from "components/InterviewerListItem";
import InterviewerList from "components/InterviewerList";
import Appointment from "components/Appointment/index";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Form from "components/Appointment/Form";

storiesOf("Button", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Base", () => <Button>Base</Button>)
  .add("Confirm", () => <Button confirm>Confirm</Button>)
  .add("Danger", () => <Button danger>Cancel</Button>)
  .add("Clickable", () => (
    <Button onClick={action("button-clicked")}>Clickable</Button>
  ))
  .add("Disabled", () => (
    <Button disabled onClick={action("button-clicked")}>
      Disabled
    </Button>
  ));

storiesOf("DayListItem", module)
.addParameters({
  backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
})
.add("Unselected", () => <DayListItem name="Monday" spots={5} />)
.add("Selected", () => <DayListItem name="Monday" spots={5} selected />) 
.add("Full", () => <DayListItem name="Monday" spots={0} />)
.add("Clickable", () => (
  <DayListItem name="Tuesday" setDay={action("setDay")} spots={5} />
));

const days = [
  {
    id: 1,
    name: "Monday",
    spots: 2,
  },
  {
    id: 2,
    name: "Tuesday",
    spots: 5,
  },
  {
    id: 3,
    name: "Wednesday",
    spots: 0,
  },
];
  
storiesOf("DayList", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }],
  })
  .add("Monday", () => (
    <DayList days={days} day={"Monday"} setDay={action("setDay")} />
  ))
  .add("Tuesday", () => (
    <DayList days={days} day={"Tuesday"} setDay={action("setDay")} />
  ));

  const interviewer = {
    id: 1,
    name: "Sylvia Palmer",
    avatar: "https://i.imgur.com/LpaY82x.png"
  };
  
storiesOf("InterviewerListItem", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Unselected", () => (
    <InterviewerListItem
      id={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
    />
  ))
  .add("Selected", () => (
    <InterviewerListItem
      id={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected
    />
  ))
  .add("Clickable", () => (
    <InterviewerListItem
      id={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      setInterviewer={event => action("setInterviewer")(interviewer.id)}
    />
  ));

const interviewers = [
  { id: 1, name: "Sylvia Palmer", avatar: "https://i.imgur.com/LpaY82x.png" },
  { id: 2, name: "Tori Malcolm", avatar: "https://i.imgur.com/Nmx0Qxo.png" },
  { id: 3, name: "Mildred Nazir", avatar: "https://i.imgur.com/T2WwVfS.png" },
  { id: 4, name: "Cohana Roy", avatar: "https://i.imgur.com/FK8V841.jpg" },
  { id: 5, name: "Sven Jones", avatar: "https://i.imgur.com/twYrpay.jpg" }
];
      
storiesOf("InterviewerList", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Initial", () => (
    <InterviewerList
      interviewers={interviewers}
      onChange={action("onChange")}
    />
  ))
  .add("Preselected", () => (
    <InterviewerList
      interviewers={interviewers}
      value={3}
      onChange={action("onChange")}
    />
  ));

storiesOf("Appointment", module)
  .addParameters({
    backgrounds: [{ name: "white", value: "#fff", default: true }]
  })
  .add("Appointment", () => (
    <Appointment />
  ))
  .add("Appointment with time", () => (
    <Appointment
      time="12pm"
    />
  ))
  .add("Header", () => (
    <Header
      time="12pm"
    />
  ))
  .add("Empty", () => (
    <Empty onAdd={action("onAdd")} />
  ))
  .add("Show", () => (
    <Show
      student="Lydia Miller-Jones"
      interviewer={interviewers[0]}
      onEdit={action("onEdit")}
      onDelete={action("onDelete")}
    />
  ))
  .add("Confirm", () => (
    <Confirm
      message="Do you want to delete the appointment?"
      onCancel={action("onCancel")}
      onConfirm={action("onConfirm")}
    />
  ))
  .add("Status saving", () => (
    <Status message="Saving..." />
  ))
  .add("Status deleting", () => (
    <Status message="Deleting..." />
  ))
  .add("Error deleting", () => (
    <Error message="Could not delete appointment" onClose={action("onClose")}/>
  ))
  .add("Error saving", () => (
    <Error message="Could not save appointment" onClose={action("onClose")} />
  ))
  .add("Edit Form", () => (
    <Form 
      name="Lydia Miller-Jones"
      interviewers={interviewers}
      interviewer={3}
      onSave={action("onSave")}
      onCancel={action("onCancel")}
      setInterviewer={action("onChange")}
    />
  ))
  .add("Create Form", () => (
    <Form 
      interviewers={interviewers}
      onSave={action("onSave")}
      onCancel={action("onCancel")}
      setInterviewer={action("onChange")}
    />
  ));