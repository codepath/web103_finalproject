// ============================================
// PREPWISE AI CALENDAR
// ============================================

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, amount) {
  const copy = new Date(date);

  copy.setUTCDate(
    copy.getUTCDate() + amount
  );

  return copy;
}

// Get the correct local date using the
// user's browser timezone.

export function getChatDates(
  timeZone,
  now = new Date()
) {
  let zone =
    typeof timeZone === "string" &&
    timeZone.length <= 80
      ? timeZone
      : "UTC";

  let formatter;

  try {
    formatter = new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
  } catch {
    zone = "UTC";

    formatter = new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
  }

  const parts = Object.fromEntries(
    formatter
      .formatToParts(now)
      .map((part) => [
        part.type,
        part.value,
      ])
  );

  const todayKey =
    `${parts.year}-${parts.month}-${parts.day}`;

  const today = new Date(
    todayKey + "T00:00:00Z"
  );

  const mondayOffset =
    (today.getUTCDay() + 6) % 7;

  const thisMonday = addDays(
    today,
    -mondayOffset
  );

  const nextMonday = addDays(
    thisMonday,
    7
  );

  const weekday = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "UTC",
      weekday: "long",
    }
  ).format(today);

  return {
    timeZone: zone,

    today: todayKey,

    weekday,

    tomorrow: dateString(
      addDays(today, 1)
    ),

    thisMonday: dateString(thisMonday),

    thisSunday: dateString(
      addDays(thisMonday, 6)
    ),

    nextMonday: dateString(nextMonday),

    nextSunday: dateString(
      addDays(nextMonday, 6)
    ),
  };
}

// ============================================
// VALIDATE CALENDAR DATE
// ============================================

function validDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(
    value + "T00:00:00Z"
  );

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

// ============================================
// RESOLVE MEAL PLAN START DATE
// ============================================

export function resolvePlanStart(
  modelStart,
  dates,
  message = ""
) {
  const text = String(message).toLowerCase();

  const explicitDate =
    /\b\d{4}-\d{2}-\d{2}\b/.test(text) ||
    /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/.test(text) ||
    /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}\b/.test(
      text
    ) ||
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(
      text
    );

  // Respect explicitly requested dates.

  if (explicitDate) {
    return validDate(modelStart)
      ? modelStart
      : dates.today;
  }

  // Resolve common relative dates directly.

  const relative = new Set();

  if (
    /\bnext\s+(?:calendar\s+)?week\b/.test(text) ||
    /\bnext\s+monday\b/.test(text)
  ) {
    relative.add(dates.nextMonday);
  }

  if (
    /\bthis\s+(?:calendar\s+)?week\b/.test(text) ||
    /\bthis\s+monday\b/.test(text)
  ) {
    relative.add(dates.thisMonday);
  }

  if (/\btomorrow\b/.test(text)) {
    relative.add(dates.tomorrow);
  }

  if (
    /\btoday\b/.test(text) ||
    /\bnext\s+(?:7|seven)\s+days\b/.test(text)
  ) {
    relative.add(dates.today);
  }

  // Only override Gemini when the date
  // request has one clear interpretation.

  if (relative.size === 1) {
    return [...relative][0];
  }

  // Preserve dates from conversation context.

  if (validDate(modelStart)) {
    return modelStart;
  }

  // Default to the user's current local date.

  return dates.today;
}