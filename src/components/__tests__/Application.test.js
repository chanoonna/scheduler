import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

// This test will fail with Websocket added to the project. Disable websocket to test this component first.
it.skip("renders without crashing", () => {
  render(<Application />);
});
