import { Group, Select } from "@mantine/core";
import { useEffect, useState } from "react";

interface TimeSelectProps {
  defaultTime?: string;
  label?: string;
  interval: number;
  onChange?: (time: string) => void;
  sx?: any;
  disabled?: boolean;
}

// defaultTime is in HH:MM format, get the correct HH:MM:AM/PM format if it exists, else return midnight
const parseDefaultTime = (time: string) => {
  if (!time) {
    return { hour: "12", minute: "00", ampm: "AM" }; // default time
  }
  let [hourStr, minuteStr] = time.split(":");
  let hourInt = parseInt(hourStr, 10);
  let ampm = hourInt >= 12 ? "PM" : "AM";
  if (hourInt > 12) {
    hourInt -= 12;
  } else if (hourInt === 0) {
    hourInt = 12;
  }
  return {
    hour: hourInt.toString().padStart(2, "0"),
    minute: minuteStr,
    ampm: ampm,
  };
};

const TimeSelect = ({
  defaultTime,
  label,
  interval,
  onChange,
  sx,
  disabled,
  ...props
}: TimeSelectProps) => {
  const time = parseDefaultTime(defaultTime);
  const [hour, setHour] = useState(time.hour);
  const [minute, setMinute] = useState(time.minute);
  const [ampm, setAmpm] = useState(time.ampm);

  // generate static data
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 / interval }, (_, i) =>
    (i * interval).toString().padStart(2, "0"),
  );

  useEffect(() => {
    // Trigger the onChange when the component mounts
    handleTimeChange(hour, minute, ampm);
  }, []);

  // HH:MM format to be returned
  const handleTimeChange = (
    updatedHour: string,
    updatedMinute: string,
    updatedAmpm: string,
  ) => {
    let formattedHour = parseInt(updatedHour);
    if (updatedAmpm === "PM" && formattedHour !== 12) {
      formattedHour += 12;
    } else if (updatedAmpm === "AM" && formattedHour === 12) {
      formattedHour = 0;
    }
    const time = `${formattedHour
      .toString()
      .padStart(2, "0")}:${updatedMinute}`;
    onChange && onChange(time);
  };

  return (
    <Group sx={sx} {...props}>
      <Select
        label={label || " "}
        disabled={disabled}
        searchable
        w={80}
        mr={-10}
        data={hours}
        value={hour}
        onChange={(value) => {
          setHour(value);
          handleTimeChange(value, minute, ampm);
        }}
        placeholder="Hour"
      />
      <Select
        label=" "
        disabled={disabled}
        searchable
        w={80}
        mr={-10}
        data={minutes}
        value={minute}
        onChange={(value) => {
          setMinute(value);
          handleTimeChange(hour, value, ampm);
        }}
        placeholder="Minute"
      />
      <Select
        label=" "
        disabled={disabled}
        searchable
        w={80}
        data={["AM", "PM"]}
        value={ampm}
        onChange={(value) => {
          setAmpm(value);
          handleTimeChange(hour, minute, value);
        }}
        placeholder="AM/PM"
      />
    </Group>
  );
};

export default TimeSelect;
