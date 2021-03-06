/**
 * When testing, please comment out lines with WebSocket
 * from ./src/hooks/useApplicationData.js
 * and remove 'skip' in this file.
 */

import React from "react";
import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  debug,
  getByText,
  queryByText,
  getByTestId,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it.skip("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday"));
  });
  
  it.skip("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    try {
      await waitForElement(() => getByText('Monday'));
  
    } catch (error) {
  
      console.log(`Promise rejected with ${error}`);
    }
  
    fireEvent.click(getByText('Tuesday'));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it.skip('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);
    
    try {
      await waitForElement(() => getByText(container, 'Archie Cohen'));

    } catch (error) {
  
      console.log(`Promise rejected with ${error}`);
    }
    
    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByTestId(appointment, 'status-message')).toHaveTextContent('Saving...')

    try {
      await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    // debug(day);
       
    expect(getByTestId(day, 'spots')).toHaveTextContent('no spots remaining');
  });

  it.skip('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    const { container, debug } = render(<Application />);

    try {
      await waitForElement(() => getByText(container, "Archie Cohen"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const appointment = getAllByTestId(container, 'appointment')
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Do you want to delete the appointment?'));

    fireEvent.click(getByText(container, 'Confirm'));
    
    expect(getByTestId(appointment, 'status-message')).toHaveTextContent('Deleting...')

    try {
      await waitForElement(() => getByAltText(appointment, "Add"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    // debug(day);
       
    expect(getByTestId(day, 'spots')).toHaveTextContent('2 spots remaining');
  });

  it.skip("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    try {
      await waitForElement(() => getByText(container, "Archie Cohen"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const appointment = getAllByTestId(container, 'appointment')
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Edit'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByTestId(appointment, 'status-message')).toHaveTextContent('Saving...')

    try {
      await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    // debug(day);
       
    expect(getByTestId(day, 'spots')).toHaveTextContent('1 spot remaining');
  });

  it.skip('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);
    
    try {
      await waitForElement(() => getByText(container, 'Archie Cohen'));

    } catch (error) {
  
      console.log(`Promise rejected with ${error}`);
    }
    
    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByTestId(appointment, 'status-message')).toHaveTextContent('Saving...');

    try {
      await waitForElement(() => getByTestId(appointment, "error"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const error = getByTestId(appointment, 'error');

    // debug(error);
       
    expect(getByText(error, 'Error occured while Saving')).toBeInTheDocument();
  });

  it.skip('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();
    
    const { container, debug } = render(<Application />);

    try {
      await waitForElement(() => getByText(container, "Archie Cohen"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const appointment = getAllByTestId(container, 'appointment')
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Do you want to delete the appointment?'));

    fireEvent.click(getByText(container, 'Confirm'));
    
    expect(getByTestId(appointment, 'status-message')).toHaveTextContent('Deleting...')

    try {
      await waitForElement(() => getByTestId(appointment, "error"));

    } catch(error) {

      console.log(`Promise rejected with ${error}`);
    }

    const error = getByTestId(appointment, 'error');

    // debug(error);
       
    expect(getByText(error, 'Error occured while Deleting')).toBeInTheDocument();
  });
});
