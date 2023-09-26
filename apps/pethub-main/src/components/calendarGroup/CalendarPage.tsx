import Calendar from "@toast-ui/react-calendar";
import React from "react";

import "tui-calendar/dist/tui-calendar.css";

const MyCalendar = (props) => <Calendar {...props} ref={props.forwardedRef} />;
MyCalendar.displayName = "MyCalendar";

export default MyCalendar;
