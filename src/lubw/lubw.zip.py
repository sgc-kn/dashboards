import datetime
import io
import pandas
import pytz
import sys
import zipfile

# --- load raw data

timezone = "Europe/Berlin"


def format_datetime_for_d3(dt):
    """
    Format datetime for d3.autoType compatibility.
    Converts +0200 to +02:00 format.
    """
    if dt is None or pandas.isna(dt):
        return None

    # Get the base datetime string without timezone
    base_str = dt.strftime("%Y-%m-%dT%H:%M:%S")

    # Get timezone offset and format it with colon
    offset = dt.strftime("%z")
    if offset:
        # Insert colon: +0200 -> +02:00
        formatted_offset = f"{offset[:3]}:{offset[3:]}"
        return f"{base_str}{formatted_offset}"
    else:
        return f"{base_str}Z"


def load_raw_data():
    this_year = datetime.date.today().year
    years = range(2008, this_year + 1)

    tables = list()
    for year in years:
        url = f"https://sgc-public-prod-de-wu5va7ls.s3-eu-central-1.ionoscloud.com/share/lubw/hourly/lubw-hourly-{year}.csv"
        df = pandas.read_csv(url)
        tables.append(df)

    df = pandas.concat(tables)

    # parse startZeit, use as index; delete redundant endZeit column
    df["startZeit"] = pandas.to_datetime(df["startZeit"])
    df.set_index("startZeit", inplace=True)
    del df["endZeit"]

    if df.index.tz is None:
        df.index = df.index.tz_localize(timezone)
    else:
        df.index = df.index.tz_convert(timezone)

    return df


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

    subset.index = subset.index.map(format_datetime_for_d3)

    return subset.reset_index()


# ---


def zip_tables_to_buf(tables, *, index=False, **kwargs):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "a", zipfile.ZIP_DEFLATED, False) as zf:
        for name, df in tables.items():
            # with zf.open(name + '.parquet', 'w') as f:
            #     df.to_parquet(f)
            with zf.open(name + ".csv", "w") as f:
                df.to_csv(f, index=index, **kwargs)
    return buf.getvalue()


if __name__ == "__main__":
    df = load_raw_data()
    tables = {"Stündlich": last_week(df)}
    zip_file = zip_tables_to_buf(tables)

    sys.stdout.buffer.write(zip_file)
