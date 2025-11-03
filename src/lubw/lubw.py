import datetime
import httpx
import pandas
import pytz

from io import BytesIO

# --- load raw data

timezone = "Europe/Berlin"


def load_raw_data():
    r = httpx.get(
        "https://api.udp-kn.de/postgrest/lubw/etraw_lubw?select=entity_id,startzeit,wert",
        headers={
            "Accept": "text/csv",
        },
    )
    r.raise_for_status()
    raw_data = pandas.read_csv(BytesIO(r.content))

    long_data = raw_data.copy()
    long_data["startZeit"] = pandas.to_datetime(long_data["startzeit"])
    long_data["sensor"] = (
        long_data["entity_id"].astype(str).str.removeprefix("urn:raw:lubw:konstanz:")
    )
    del long_data["startzeit"]
    del long_data["entity_id"]

    wide_data = long_data.pivot_table(
        index="startZeit", columns="sensor", values="wert", aggfunc="first"
    )

    if wide_data.index.tz is None:
        wide_data.index = wide_data.index.tz_localize(timezone)
    else:
        wide_data.index = wide_data.index.tz_convert(timezone)

    return wide_data


# ---


def last_week_range(*, timezone=timezone):
    # Get current date in specified timezone
    now = datetime.datetime.now(pytz.timezone(timezone))

    # Find last Sunday (end of previous complete week)
    days_since_sunday = (now.weekday() + 1) % 7
    if days_since_sunday == 0:  # If today is Sunday, go to previous week
        days_since_sunday = 7

    last_sunday = now - datetime.timedelta(days=days_since_sunday)
    last_monday = last_sunday - datetime.timedelta(days=6)

    # Filter data for the week
    start_date = last_monday.date()
    end_date = last_sunday.date()

    return (start_date, end_date)


def last_week(df, **kwargs):
    start_date, end_date = last_week_range(**kwargs)

    mask = (df.index.date >= start_date) & (df.index.date <= end_date)

    subset = df[mask]

    return subset.reset_index()


# ---


def weekly_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    # Aggregate the data, weeks starting on Monday
    agg = df.resample("W-MON").agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    # Reset index and add week start
    agg.reset_index(inplace=True)
    agg.rename(columns={"startZeit": "week_ending"}, inplace=True)
    agg["week_start"] = agg["week_ending"] - pandas.Timedelta(days=6)

    # Convert datetimes to date
    agg["week_start"] = agg["week_start"].dt.date
    agg["week_ending"] = agg["week_ending"].dt.date

    # Reorder columns
    cols = ["week_start", "week_ending"] + [
        col for col in agg.columns if col not in ["week_start", "week_ending"]
    ]

    return agg[cols].iloc[:-1]  # ignore last row because it is based on incomplete data


def monthly_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    # Aggregate the data, weeks starting on Monday
    agg = df.resample("M").agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    # Reset index and add week start
    agg.reset_index(inplace=True)
    agg.rename(columns={"startZeit": "end"}, inplace=True)
    agg["start"] = agg["end"].apply(lambda dt: dt.replace(day=1))

    # Convert datetimes to date
    agg["start"] = agg["start"].dt.date
    agg["end"] = agg["end"].dt.date

    # Reorder columns
    cols = ["start", "end"] + [
        col for col in agg.columns if col not in ["start", "end"]
    ]

    return agg[cols].iloc[:-1]  # ignore last row because it is based on incomplete data


def yearly_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    # Aggregate the data, weeks starting on Monday
    agg = df.resample("Y").agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    # Reset index and add week start
    agg.reset_index(inplace=True)
    agg.rename(columns={"startZeit": "end"}, inplace=True)
    agg["start"] = agg["end"].apply(lambda dt: dt.replace(month=1, day=1))

    # Convert datetimes to date
    agg["start"] = agg["start"].dt.date
    agg["end"] = agg["end"].dt.date

    # Reorder columns
    cols = ["start", "end"] + [
        col for col in agg.columns if col not in ["start", "end"]
    ]

    return agg[cols].iloc[:-1]  # ignore last row because it is based on incomplete data


def month_of_year_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    df["month"] = df.index.month
    df["month_name"] = df.index.month_name()

    # Aggregate the data, weeks starting on Monday
    agg = df.groupby(["month", "month_name"]).agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    return agg.reset_index()


def day_of_week_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    df["day_of_week"] = df.index.day_of_week

    # Aggregate the data, weeks starting on Monday
    agg = df.groupby("day_of_week").agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    agg["day"] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Son"]

    # Reorder columns
    first_cols = ["day"]
    cols = first_cols + [x for x in agg.columns if x not in first_cols]
    agg = agg[cols]

    return agg.reset_index()


def hour_of_day_stats(df):
    df = df.copy()

    # Localize the start time for correct aggregation
    df.index = df.index.tz_convert("Europe/Berlin")

    df["hour_of_day"] = df.index.hour

    # Aggregate the data, weeks starting on Monday
    agg = df.groupby("hour_of_day").agg(["mean", "median", "min", "max"])

    # Flatten column names
    agg.columns = ["_".join(col) for col in agg.columns]

    return agg.reset_index()
