import { Group, Select } from "@mantine/core";
import { useEffect, useState } from "react";

interface TimeSelectProps {
  label?: string;
  interval: number;
  onChange?: (time: string) => void;
  sx?: any;
}

const TimeSelect = ({
  label,
  interval,
  onChange,
  sx,
  ...props
}: TimeSelectProps) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

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
