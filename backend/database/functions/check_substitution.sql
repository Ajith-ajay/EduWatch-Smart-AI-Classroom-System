CREATE OR REPLACE FUNCTION check_substitution(p_timetable_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    substitute_id INTEGER;
BEGIN
    SELECT substitute_teacher_id
    INTO substitute_id
    FROM teacher_substitution
    WHERE timetable_id = p_timetable_id
    AND substitution_date = CURRENT_DATE;

    IF substitute_id IS NOT NULL THEN
        RETURN substitute_id;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;