import io
import lubw
import pandas
import sys
import zipfile


def zip_tables_to_buf(tables, *, index=False, **kwargs):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "a", zipfile.ZIP_DEFLATED, False) as zf:
        for name, df in tables.items():
            # with zf.open(name + '.parquet', 'w') as f:
            #     df.to_parquet(f)
            with zf.open(name + ".csv", "w") as f:
                df.to_csv(f, index=index, **kwargs)
    return buf.getvalue()


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


if __name__ == "__main__":
    df = lubw.load_raw_data()

    lw = lubw.last_week(df)
    lw["startZeit"] = lw.startZeit.map(format_datetime_for_d3)

    tables = {
        "Auszug_Stundenwerte": lw,
        "Monatliche_Statistik": lubw.monthly_stats(df),
        "Jährliche_Statistik": lubw.yearly_stats(df),
    }
    zip_file = zip_tables_to_buf(tables)

    sys.stdout.buffer.write(zip_file)
