import dayjs from "dayjs";
import { sortBy } from "lodash";
import {
  CalendarGroup,
  DayOfWeekEnum,
  OrderItem,
  Recurrence,
  RecurrencePatternEnum,
  ScheduleSettings,
  ServiceListing,
  TimePeriod,
} from "shared-utils";
import { PetLostAndFound } from "./types/types";

// Convert param to string
export function parseRouterQueryParam(param: string | string[] | undefined) {
  if (!param) {
    return null;
  }
  if (Array.isArray(param)) {
    param = param.join("");
  }
  return param;
}

export function validateAddressName(addressName: string) {
  if (!addressName) {
    return "Address name is required.";
  }
  if (addressName.length > 12) {
    return "Address name must be 12 characters or below.";
  }
  if (addressName.startsWith(" ") || addressName.endsWith(" ")) {
    return "Address name should not have leading or trailing spaces.";
  }

  return null;
}

export function validateWebsiteURL(url: string) {
  return !/^https?:\/\/.+\..+$/.test(url);
}

export function searchServiceListingsForCustomer(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter(
    (serviceListing: ServiceListing) =>
      serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
      serviceListing.petBusiness?.companyName
        .toLowerCase()
        .includes(searchStr.toLowerCase()),
  );
}

export function searchOrderItemsForCustomer(
  orderItems: OrderItem[],
  searchStr: string,
) {
  const search = searchStr.toLowerCase();

  return orderItems.filter(
    (orderItem: OrderItem) =>
      orderItem.itemName?.toLowerCase().includes(search) ||
      orderItem.orderItemId?.toString() === search ||
      orderItem.serviceListing?.petBusiness?.companyName
        ?.toLowerCase()
        .includes(search),
  );
}

// generic sort by function
export function sortRecords(
  sortOptions: any,
  records: any[],
  sortStatus: string,
) {
  let sorted = records;
  if (!sortStatus) return sorted;

  const sortOption = sortOptions.find((x) => sortStatus === x.value);
  sorted = sortBy(records, sortOption.attribute);
  if (sortOption.direction == "desc") {
    sorted.reverse();
  }
  return sorted;
}

// The below functions are used in the CalenderGroupForm component
function doesDateOverlap(
  dateStartA: string,
  dateEndA: string,
  dateStartB: string,
  dateEndB: string,
) {
  return dateStartA <= dateEndB && dateStartB <= dateEndA;
}

function doesTimeOverlap(
  startTimeA: string,
  endTimeA: string,
  startTimeB: string,
  endTimeB: string,
) {
  return startTimeA < endTimeB && startTimeB < endTimeA;
}

function validateCGDays(days: string[], pattern: string) {
  if (pattern === "WEEKLY" && (!days || days.length === 0)) {
    return "At least one selection for a recurring day is compulsory if the recurrence pattern is set to 'Weekly'.";
  }
  if (
    days &&
    days.some(
      (day) => !Object.values(DayOfWeekEnum).includes(day as DayOfWeekEnum),
    )
  ) {
    return "days must be one of [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]."; // A just-in-case check
  }
  return null;
}

function validateCGTimePeriodEndOverStart(timePeriod: TimePeriod) {
  return timePeriod.endTime <= timePeriod.startTime
    ? "End time must be after start time."
    : null;
}

function validateCGTimePeriodOverlap(timePeriods: TimePeriod[]) {
  const timePeriodErrors: any = {};

  for (let i = 0; i < timePeriods.length; i++) {
    for (let j = i + 1; j < timePeriods.length; j++) {
      if (
        doesTimeOverlap(
          timePeriods[i].startTime,
          timePeriods[i].endTime,
          timePeriods[j].startTime,
          timePeriods[j].endTime,
        )
      ) {
        timePeriodErrors[i] = `This time period overlaps with time period ${
          j + 1
        }.`;
        timePeriodErrors[j] = `This time period overlaps with time period ${
          i + 1
        }.`;
      }
    }
  }

  return timePeriodErrors;
}

function validateCGDates(recurrence: Recurrence) {
  const errors: any = {};

  if (!recurrence.startDate) errors.startDate = "Start date is required.";
  if (!recurrence.endDate) errors.endDate = "End date is required.";

  if (Object.keys(errors).length > 0) return errors;

  const today = new Date();
  const parsedStartDate = new Date(recurrence.startDate);
  const parsedEndDate = new Date(recurrence.endDate);
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  if (parsedEndDate < parsedStartDate)
    errors.endDate = "End date must be after start date.";
  if (parsedEndDate > threeMonthsFromNow)
    errors.endDate =
      "End date must not be more than 3 months from current date.";

  return errors;
}

function validateCGRecurrence(recurrence: Recurrence) {
  const errors: any = validateCGDates(recurrence) || {};

  const timePeriodStartEndErrors: { [key: number]: string } = {};
  let hasEndOverStartError = false;

  // Validate end time over start time
  recurrence.timePeriods.forEach((timePeriod, index) => {
    const error = validateCGTimePeriodEndOverStart(timePeriod);
    if (error) {
      timePeriodStartEndErrors[index] = error;
      hasEndOverStartError = true;
    }
  });
  // Check for overlapping time periods only if there are no time periods with endtime > startTime
  if (!hasEndOverStartError) {
    const timePeriodOverlapErrors = validateCGTimePeriodOverlap(
      recurrence.timePeriods,
    );
    if (Object.keys(timePeriodOverlapErrors).length > 0) {
      errors.timePeriods = timePeriodOverlapErrors;
    }
  } else if (Object.keys(timePeriodStartEndErrors).length > 0) {
    errors.timePeriods = timePeriodStartEndErrors;
  }
  return Object.keys(errors).length === 0 ? null : errors;
}

export function validateCGSettings(scheduleSettings: ScheduleSettings[]) {
  if (!scheduleSettings || scheduleSettings.length === 0) {
    return { scheduleSettingsError: "At least one schedule is required" };
  }

  const errors: { [key: number]: any } = {}; // Use an object to store errors with index as key

  scheduleSettings.forEach((setting, index) => {
    const daysError = validateCGDays(setting.days, setting.recurrence.pattern);
    const recurrenceErrors = validateCGRecurrence(setting.recurrence);

    if (daysError || recurrenceErrors) {
      errors[index] = {
        days: daysError,
        recurrence: recurrenceErrors,
      };
    }
  });

  return Object.keys(errors).length === 0 ? null : { errors };
}

export function validateCGName(name: string) {
  if (!name) {
    return "Name is required for calendar group.";
  }
  if (name.length > 72) {
    return "Calendar Group Name should be at most 72 characters long.";
  }
  return null;
}

// Returns an array of days between two dates inclusive
function getDaysBetweenDates(inputStartDate, endDate) {
  const start = new Date(inputStartDate);
  const days = [];
  while (start <= endDate) {
    days.push(dayjs(start).format("YYYY-MM-DD"));
    start.setUTCDate(start.getUTCDate() + 1);
  }
  return days;
}

/* 
  Check if there are any conflicts or violations of the business rules for the schedule settings
  All mandatory fields should be filled in already, since this function should be called after form validation passes (create button)
*/
export function checkCGForConflicts(scheduleSettings: ScheduleSettings[]) {
  function getEffectiveDays(recurrence: Recurrence, days: string[]) {
    const allDays = getDaysBetweenDates(
      recurrence.startDate,
      recurrence.endDate,
    );
    if (recurrence.pattern === RecurrencePatternEnum.Daily) {
      return allDays;
    } else {
      const dayOfWeekEnumMapping = {
        // dayjs treats 0 as sunday
        [DayOfWeekEnum.Sunday]: 0,
        [DayOfWeekEnum.Monday]: 1,
        [DayOfWeekEnum.Tuesday]: 2,
        [DayOfWeekEnum.Wednesday]: 3,
        [DayOfWeekEnum.Thursday]: 4,
        [DayOfWeekEnum.Friday]: 5,
        [DayOfWeekEnum.Saturday]: 6,
      };
      return allDays.filter((date) => {
        const dayOfWeek = new Date(date).getDay();
        return days.includes(
          Object.keys(dayOfWeekEnumMapping).find(
            (key) => dayOfWeekEnumMapping[key] === dayOfWeek,
          ) || "",
        );
      });
    }
  }

  function createErrorMessage(
    settingAIndex: number,
    settingBIndex: number,
    pattern: RecurrencePatternEnum,
    overlappingDatesArray: string[],
  ) {
    const headErrorMessage = `There are conflicts with the schedule settings for schedule: ${
      settingAIndex + 1
    } and schedule: ${settingBIndex + 1}. `;

    const firstThreeDates = overlappingDatesArray.slice(0, 3).join(", ");
    const tailErrorMessage =
      overlappingDatesArray.length > 3
        ? `${firstThreeDates}, ...`
        : firstThreeDates;

    return pattern === RecurrencePatternEnum.Weekly
      ? headErrorMessage +
          "There is a date overlap between these schedules with recurrence pattern: 'Weekly', the overlapping day(s) are on: " +
          tailErrorMessage
      : headErrorMessage +
          "Please ensure that there is no date overlap between the schedules of these settings with recurrence pattern: 'Daily'. The overlapping day(s) are on: " +
          tailErrorMessage;
  }

  function checkOverlapBetweenSettings(settings: any) {
    for (let i = 0; i < settings.length; i++) {
      const settingA = settings[i].setting;
      const indexA = settings[i].originalIndex;
      for (let j = i + 1; j < settings.length; j++) {
        const settingB = settings[j].setting;
        const indexB = settings[j].originalIndex;
        if (
          doesDateOverlap(
            settingA.recurrence.startDate,
            settingA.recurrence.endDate,
            settingB.recurrence.startDate,
            settingB.recurrence.endDate,
          )
        ) {
          const effectiveDaysA = getEffectiveDays(
            settingA.recurrence,
            settingA.days,
          );
          const effectiveDaysB = getEffectiveDays(
            settingB.recurrence,
            settingB.days,
          );
          const overlappingDays = effectiveDaysA.filter((day) =>
            effectiveDaysB.includes(day),
          );
          // If there are overlapping days, disallow creation
          if (overlappingDays.length > 0) {
            return {
              errorMessage: createErrorMessage(
                indexA,
                indexB,
                settingA.recurrence.pattern,
                overlappingDays,
              ),
              indexA: indexA, // Used to highlight the settings card red
              indexB: indexB,
            };
          }
        }
      }
    }
    return null;
  }

  // Separate weekly and daily and store both the setting and its original index coz splitting it will mess up the index in the error msg otherwise
  const weeklySettings = scheduleSettings
    .map((setting, index) => ({ setting, originalIndex: index }))
    .filter(
      (item) =>
        item.setting.recurrence.pattern === RecurrencePatternEnum.Weekly,
    );

  const dailySettings = scheduleSettings
    .map((setting, index) => ({ setting, originalIndex: index }))
    .filter(
      (item) => item.setting.recurrence.pattern === RecurrencePatternEnum.Daily,
    );

  // Check weekly first then check daily
  let result = checkOverlapBetweenSettings(weeklySettings);
  if (result) return result;
  return checkOverlapBetweenSettings(dailySettings);
}

// Clean the dates, clear the IDs, and remove irrelavant fields before sending to backend
export function sanitizeCGPayload(calendarGroup: CalendarGroup): CalendarGroup {
  const CGCopy: CalendarGroup = JSON.parse(JSON.stringify(calendarGroup)); // deep copy

  for (const setting of CGCopy.scheduleSettings) {
    // // Make sure that the start date is after today to appease BE validation
    // if (dayjs(setting.recurrence.startDate).isBefore(dayjs().add(1, "day"), "day")) {
    //   setting.recurrence.startDate = dayjs().add(1, "day").format("YYYY-MM-DD");
    // }

    // Remove the time gibberish behind the date
    setting.recurrence.startDate = dayjs(setting.recurrence.startDate).format(
      "YYYY-MM-DD",
    );
    setting.recurrence.endDate = dayjs(setting.recurrence.endDate).format(
      "YYYY-MM-DD",
    );
    // Remove the IDs and pointless arrays
    delete setting.scheduleSettingsId;
    if (setting.recurrence.pattern === RecurrencePatternEnum.Daily) {
      delete setting.days;
    }
    for (const timePeriod of setting.recurrence.timePeriods) {
      delete timePeriod.timePeriodId;
    }
  }
  return CGCopy;
}

// for pet
export const calculateAge = (dateOfBirth: any) => {
  const currentDate = new Date();
  const dob = new Date(dateOfBirth);
  let age = dayjs(currentDate).diff(dob, "years");

  if (age == 0) {
    age = dayjs(currentDate).diff(dob, "months");
    return `${age} month${age !== 1 ? "s" : ""}`;
  }
  return `${age} year${age > 1 ? "s" : ""}`;
};
