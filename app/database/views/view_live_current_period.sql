CREATE OR REPLACE VIEW view_live_current_period AS
SELECT *
FROM view_today_schedule
WHERE CURRENT_TIME BETWEEN start_time AND end_time;