import polars as pl
import datetime as dt

df_csv = pl.read_csv("voice-log.csv")
print("Raw input")
print(df_csv)

df_parsed_dates = df_csv.with_columns(
    pl.col("datetime").str.to_datetime(time_zone="Europe/London", strict=False)
).filter(pl.col("datetime").is_not_null())
print("Parse datetimes")
print(df_parsed_dates)

channel_names = {
    813780910285127700: "Just Hangin'",
    971357443298836490: "Sweaty Tryhards",

}

df = df_parsed_dates.with_columns(
    weekday_number=pl.col("datetime").dt.weekday(),
    weekday=pl.col("datetime").dt.strftime("%A"),
    time=pl.col("datetime").dt.strftime(format="%H:%M"),
    time_of_week=pl.col("datetime").dt.strftime(format="%u:%H:%M"),
    date=pl.col("datetime").dt.date(),
    month=pl.col("datetime").dt.strftime("%B %Y"),
    channel_name=pl.col("channelId").replace_strict(channel_names, default="Other"),
)
print("Adding calculated fields")
# print(df)
start_date = df.select("date").min().item()
end_date = df.select("date").max().item()
user_minutes = df.select("count").sum().item()
total_count = df.select("count").count().item()
range_days = (df.select("date").max().item() - df.select("date").min().item()).days
print(f"M9s spend a collective {round(user_minutes / (60 * 24)):d} days in voice chat since {start_date}")
print(f"There was someone in chat {total_count / (60 * 24 * range_days):2.2f}% of the time")

most_users = df.select("count").max().item()
most_users_date = df.select(
    date=pl.col("date").top_k_by("count", k=1)
).item()
print(f"The most users recorded in chat at once was {most_users} on {most_users_date}")

busiest_date = df.group_by(pl.col("date")).agg(
    pl.col("count").sum()
).select(date=pl.col("date").top_k_by("count", k=5))
print(f"The busiest day was {busiest_date}")
weekday_summary = df.group_by("weekday_number")\
    .agg(
        (pl.col("count").sum() / user_minutes) * 100,
        pl.col("weekday").max(),
    ).sort(pl.col("weekday_number")).select("weekday", "count")
print("Writing weekday breakdown to output/weekday.csv...")
weekday_summary.write_csv("output/weekday.csv")

totals_by_date = df.group_by("date").agg(
    pl.col("count").sum()
).sort(pl.col("date"))
print("Writing date totals to output/date_totals.csv")
totals_by_date.write_csv("output/date_totals.csv")

totals_by_channel=df.group_by("channel_name").agg(
    (pl.col("count").sum() / user_minutes) * 100,
).sort("count", descending=True)
print(totals_by_channel)

time_of_week_analysis = df.group_by(pl.col("time")).agg(pl.col("count").sum()).sort("count", descending=True)
print(time_of_week_analysis)
# print("On average the busiest time of week is {}")