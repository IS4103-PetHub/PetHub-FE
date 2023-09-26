/* eslint-disable react/display-name */
import {
  ActionIcon,
  Button,
  Group,
  SegmentedControl,
  Select,
  Text,
} from "@mantine/core";
import "@toast-ui/calendar/dist/toastui-calendar.css";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BookingsModal from "./BookingsModal";

const TuiCalendar = dynamic(() => import("./CalendarPage"), { ssr: false });
const CalendarWithForwardedRef = forwardRef((props, ref) => (
  <TuiCalendar {...props} forwardedRef={ref} />
));

const MainCalendar = ({ calendarGroupings, bookings }) => {
  /*
   * Component State
   */
  // @ts-ignore
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [selectedCalendarId, setSelectedCalendarId] = useState("all");
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [isBookingModalOpen, { close: closeView, open: openView }] =
    useDisclosure(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const calendarRef = useRef(null);

  /*
   * Effect Hooks
   */
  useEffect(() => {
    let formattedDateRange = "";
    if (currentView === "month") {
      formattedDateRange = selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
    } else if (currentView === "week") {
      const startDate = new Date(selectedDate);
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      formattedDateRange = `${startDate.toLocaleDateString()} ~ ${endDate.toLocaleDateString()}`;
    } else if (currentView === "day") {
      formattedDateRange = selectedDate.toLocaleDateString();
    }
    setCurrentDateRange(formattedDateRange);
  }, [selectedDate, currentView]);

  useEffect(() => {
    convertCalendarGroupings().then((fetchedCalendars) => {
      setCalendars(fetchedCalendars);
    });
  }, [calendarGroupings]);

  useEffect(() => {
    convertBookingsToEvents().then((events) => {
      setEvents(events);
    });
  }, [bookings]);

  /*
   * Handlers
   */

  const navigateToToday = () => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      calendarInstance.today();
      const currentDate = calendarInstance.getDate();
      updateCurrentDateRange(currentDate);
    }
  };
  const navigateTimePrev = () => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      calendarInstance.prev();
      const currentDate = calendarInstance.getDate();
      updateCurrentDateRange(currentDate);
    }
  };

  const navigateTimeNext = () => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      calendarInstance.next();
      const currentDate = calendarInstance.getDate();
      updateCurrentDateRange(currentDate);
    }
  };

  const updateCurrentDateRange = (date) => {
    const calendarInstance = calendarRef.current?.getInstance();
    if (calendarInstance) {
      const currentView = calendarInstance.getViewName();

      let formattedDateRange = "";

      if (currentView === "month") {
        formattedDateRange = date.d.d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        });
      } else if (currentView === "week") {
        const startDate = new Date(date.d.d);
        startDate.setDate(date.getDate() - date.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        formattedDateRange = `${startDate.toLocaleDateString()} ~ ${endDate.toLocaleDateString()}`;
      } else if (currentView === "day") {
        formattedDateRange = date.d.d.toLocaleDateString();
      }
      setCurrentDateRange(formattedDateRange);
    }
  };

  const handleCalendarChange = (value) => {
    setSelectedCalendarId(value);
  };

  const handleViewToggle = (value) => {
    setCurrentView(value);
  };

  const handleEditCalendarGroup = () => {
    const selectedCalendarGroup = calendarGroupings.find(
      (group) => group.calendarGroupId == selectedCalendarId,
    );
    console.log("EDITING", selectedCalendarGroup);
  };

  const handleViewCalendarGroup = () => {
    const selectedCalendarGroup = calendarGroupings.find(
      (group) => group.calendarGroupId == selectedCalendarId,
    );
    console.log("VIEWING", selectedCalendarGroup);
  };

  const onClickEvent = useCallback((e) => {
    const selectedEvent = bookings.find((event) => event.id == e.event.id);
    setSelectedBooking(selectedEvent);
    console.log(selectedEvent);
    openView();
    // route to somewhere else
  }, []);

  /*
   * Helper Functions
   */
  async function convertBookingsToEvents() {
    const events = bookings.map((booking) => {
      return {
        id: `${booking.id}`,
        title: booking.serviceListing.title,
        calendarId: booking.timeSlot
          ? booking.timeSlot.calendarGroupId.toString()
          : "0",
        start: booking.startTime,
        end: booking.endTime,
      };
    });
    return events;
  }

  const filteredEvents =
    selectedCalendarId === "all"
      ? events
      : events.filter((event) => event.calendarId === selectedCalendarId);

  async function convertCalendarGroupings() {
    const calendars = assignRandomColors(calendarGroupings);
    return calendars;
  }

  // Assigning Calendar Group
  function assignRandomColors(calendarGroups) {
    const assignedColors = {};

    return calendarGroups.map((group) => {
      let backgroundColor;
      let borderColor;

      do {
        const generateColor = getRandomColor();
        backgroundColor = generateColor;
        borderColor = generateColor;
      } while (assignedColors[backgroundColor] || assignedColors[borderColor]);

      assignedColors[backgroundColor] = true;
      assignedColors[borderColor] = true;

      return {
        id: group.calendarGroupId.toString(),
        name: group.name,
        backgroundColor,
        borderColor,
      };
    });
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Group position="apart">
        <Select
          label="Calendar Group"
          data={[
            { value: "all", label: "All" },
            ...calendars.map((calendar) => ({
              value: calendar.id.toString(),
              label: calendar.name,
            })),
          ]}
          value={selectedCalendarId}
          onChange={(value) => handleCalendarChange(value)}
        />
        <Group>
          {selectedCalendarId !== "all" ? (
            <Button onClick={handleViewCalendarGroup}>View</Button>
          ) : null}
          {selectedCalendarId !== "all" ? (
            <Button onClick={handleEditCalendarGroup}>Edit</Button>
          ) : null}
        </Group>
      </Group>
      <Group position="apart">
        <Group>
          {/* Toggle within month, week, day */}
          <SegmentedControl
            value={currentView}
            onChange={handleViewToggle}
            data={[
              { value: "month", label: "Month" },
              { value: "week", label: "Week" },
              { value: "day", label: "Day" },
            ]}
          />
        </Group>
        <Group position="center">
          <ActionIcon onClick={navigateTimePrev} variant="outline" size="lg">
            <IconArrowBigLeft />
          </ActionIcon>
          <Button onClick={navigateToToday} variant="outline">
            Today
          </Button>
          <ActionIcon onClick={navigateTimeNext} variant="outline" size="lg">
            <IconArrowBigRight />
          </ActionIcon>
        </Group>
      </Group>
      <Group position="center">
        <Text>{currentDateRange}</Text>
      </Group>
      <CalendarWithForwardedRef
        ref={calendarRef}
        // @ts-ignore
        height={"80vh"}
        calendars={calendars}
        view={currentView}
        events={filteredEvents}
        isReadOnly
        usageStatistics={false}
        onClickEvent={onClickEvent}

        // useDetailPopup
        // useFormPopup
      />

      <BookingsModal
        booking={selectedBooking}
        onClose={closeView}
        opened={isBookingModalOpen}
      />
    </div>
  );
};
MainCalendar.displayName = "MainCalendar";
export default MainCalendar;
