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
import { validateCalendarGroupSettings } from "@/util";
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
      scheduleSettings: [],
    },
    validate: {
      name: (value) =>
        !value || value.length >= 32
          ? "Name is required and should be at most 32 characters long."
          : null,
      description: (value) => (!value ? "Description is required." : null),
      scheduleSettings: (value) => validateCalendarGroupSettings(value),
    },
  });

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
      <CalendarGroupForm form={form} onClose={closeAndReset} />
    </Modal>
  );
};

export default CalendarGroupModal;
