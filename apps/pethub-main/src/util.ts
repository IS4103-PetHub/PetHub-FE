import dayjs from "dayjs";
import { DayOfWeekEnum, RecurrencePatternEnum } from "./types/constants";
import {
  CalendarGroup,
  Recurrence,
  ScheduleSettings,
  ServiceListing,
  TimePeriod,
} from "./types/types";

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

export function formatISODateString(dateString: string) {
  // e.g. 1 September 2023
  return dayjs(dateString).format("D MMMM YYYY");
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

export function formatPriceForDisplay(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export const formatEnumValueToLowerCase = (value: string) => {
  return value.replace(/_/g, " ").toLowerCase();
};

export function searchServiceListingsForPB(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter((serviceListing: ServiceListing) => {
    const formattedCategory = formatEnumValueToLowerCase(
      serviceListing.category,
    );
    const formattedTags = serviceListing.tags.map((tag) =>
      tag.name.toLowerCase(),
    );
    return (
      serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
      formattedCategory.includes(searchStr.toLowerCase()) ||
      formattedTags.some((tag) => tag.includes(searchStr.toLowerCase()))
    );
  });
}

export function searchServiceListingsForCustomer(
  serviceListings: ServiceListing[],
  searchStr: string,
) {
  return serviceListings.filter((serviceListing: ServiceListing) => {
    return (
      serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
      serviceListing.petBusiness?.companyName
        .toLowerCase()
        .includes(searchStr.toLowerCase())
    );
  });
}

// The below functions are used in the CalenderGroupForm component

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

function validateCGVacancies(vacancies: number) {
  return vacancies < 1 ? "Vacancies must be at least 1." : null;
}

function validateCGTimePeriod(timePeriod: TimePeriod) {
  return timePeriod.endTime <= timePeriod.startTime
    ? "End time must be after start time."
    : null;
}

function validateCGRecurrence(recurrence: Recurrence) {
  const errors: any = {};

  if (!recurrence.startDate || !recurrence.endDate) {
    if (!recurrence.startDate) errors.startDate = "Start date is required.";
    if (!recurrence.endDate) errors.endDate = "End date is required.";
  } else {
    const today = new Date();
    const parsedStartDate = new Date(recurrence.startDate);
    const parsedEndDate = new Date(recurrence.endDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    if (parsedStartDate <= today) {
      errors.startDate = "Start date must be after today.";
    }
    if (parsedEndDate < parsedStartDate) {
      errors.endDate = "End date must be after start date.";
    }
    if (parsedEndDate > threeMonthsFromNow) {
      errors.endDate =
        "End date must not be more than 3 months from current date.";
    }
  }
  // Validate time periods and push errors if they exist
  const timePeriodErrors: { [key: number]: string } = {};

  recurrence.timePeriods.forEach((timePeriod, index) => {
    const timePeriodError = validateCGTimePeriod(timePeriod);
    if (timePeriodError) {
      timePeriodErrors[index] = timePeriodError;
    }
  });

  if (Object.keys(timePeriodErrors).length > 0) {
    errors.timePeriods = timePeriodErrors;
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
    const vacanciesError = validateCGVacancies(setting.vacancies);
    const recurrenceErrors = validateCGRecurrence(setting.recurrence);

    if (daysError || vacanciesError || recurrenceErrors) {
      errors[index] = {
        days: daysError,
        vacancies: vacanciesError,
        recurrence: recurrenceErrors,
      };
    }
  });

  return Object.keys(errors).length === 0 ? null : { errors };
}

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

// Returns an array of days between two dates inclusive
function getDaysBetweenDates(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  // to accommodate JS's Date.getDay() function which returns 0 for Sunday as so on
  const dayOfWeekEnumMapping = [
    DayOfWeekEnum.Sunday,
    DayOfWeekEnum.Monday,
    DayOfWeekEnum.Tuesday,
    DayOfWeekEnum.Wednesday,
    DayOfWeekEnum.Thursday,
    DayOfWeekEnum.Friday,
    DayOfWeekEnum.Saturday,
  ];
  while (start <= end) {
    days.push(dayOfWeekEnumMapping[start.getDay()]);
    start.setDate(start.getDate() + 1);
  }
  return days;
}

/* 
  Check if there are any overlaps between all the time periods generated
  All mandatory fields should be filled in already, since this function should be called after form validation passes (create button)
*/
export function checkCGForOverlappingTimePeriods(
  scheduleSettings: ScheduleSettings[],
) {
  // Finds the effective days of recurrence. If 'DAILY', it takes all days but also considers the start and end dates. If 'WEEKLY' it just takes the days array
  function getDaysInQuestion(recurrence: Recurrence, days: string[]) {
    if (recurrence.pattern === "DAILY") {
      return getDaysBetweenDates(recurrence.startDate!, recurrence.endDate!);
    } else {
      return days;
    }
  }

  for (let i = 0; i < scheduleSettings.length; i++) {
    const settingA = scheduleSettings[i];
    for (let j = i + 1; j < scheduleSettings.length; j++) {
      const settingB = scheduleSettings[j];

      if (settingA.recurrence && settingB.recurrence) {
        // Check for overlapping dates
        if (
          doesDateOverlap(
            settingA.recurrence.startDate,
            settingA.recurrence.endDate,
            settingB.recurrence.startDate,
            settingB.recurrence.endDate,
          )
        ) {
          // Get effective days based on the pattern to check for overlap
          const effectiveDaysA = getDaysInQuestion(
            settingA.recurrence,
            settingA.days,
          );
          const effectiveDaysB = getDaysInQuestion(
            settingB.recurrence,
            settingB.days,
          );

          // If have overlapping dates, check for overlapping days
          const overlappingDays = effectiveDaysA.filter((day) =>
            effectiveDaysB.includes(day),
          );

          if (overlappingDays.length > 0) {
            // If have overlapping days, check for overlapping time periods
            for (
              let aIndex = 0;
              aIndex < settingA.recurrence.timePeriods!.length;
              aIndex++
            ) {
              const timePeriodA = settingA.recurrence.timePeriods![aIndex];
              for (
                let bIndex = 0;
                bIndex < settingB.recurrence.timePeriods!.length;
                bIndex++
              ) {
                const timePeriodB = settingB.recurrence.timePeriods![bIndex];
                if (
                  doesTimeOverlap(
                    timePeriodA.startTime,
                    timePeriodA.endTime,
                    timePeriodB.startTime,
                    timePeriodB.endTime,
                  )
                ) {
                  return {
                    settingAIndex: i,
                    settingBIndex: j,
                    timePeriodAIndex: aIndex,
                    timePeriodBIndex: bIndex,
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  return null; // no overlaps found
}

/* 
  E.g. for CG with 2 ScheduleSettings with recurrence WEEKLY with the same start and end date, vacancies, days, but different time periods
    we can combine them into 1 ScheduleSetting with the time periods merged
    ...Others
*/
export function simplifyCreateCGPayload(calendarGroup: CalendarGroup) {}
