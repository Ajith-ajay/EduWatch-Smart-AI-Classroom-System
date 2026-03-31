from core.db_connection import fetch_query

def get_current_period():
    query = "SELECT * FROM view_live_current_period;"
    result = fetch_query(query)

    if result:
        return result[0]
    return None