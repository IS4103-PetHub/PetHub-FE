import {
  Container,
  Group,
  Box,
  Badge,
  Modal,
  Textarea,
  Button,
  Grid,
  Text,
  Center,
  Title,
  Switch,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { validateCalendarTimeslotsAndSettings } from "@/util";
import CalendarGroupForm from "./CalendarGroupForm";

interface CalendarGroupModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

const CalendarGroupModal = ({
  opened,
  open,
  close,
}: CalendarGroupModalProps) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      timeslots: [],
      scheduleSettings: [],
    },
    validate: {
      name: (value) =>
        !value || value.length < 16
          ? "Name is required and should be at least 16 characters long."
          : null,
      description: (value) => (!value ? "Description is required." : null),
      timeslots: (value, values) =>
        validateCalendarTimeslotsAndSettings(
          values.timeslots,
          values.scheduleSettings,
        ),
      scheduleSettings: (value, values) =>
        validateCalendarTimeslotsAndSettings(
          values.timeslots,
          values.scheduleSettings,
        ),
    },
  });

  function handleSubmit() {}

  function closeAndReset() {
    form.reset();
    close();
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Create calendar group"
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <CalendarGroupForm
        form={form}
        onCreate={handleSubmit}
        onClose={closeAndReset}
      />
    </Modal>
  );
};

export default CalendarGroupModal;
