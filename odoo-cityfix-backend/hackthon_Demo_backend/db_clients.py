from pymongo import MongoClient
import psycopg2
from django.conf import settings


def get_mongo_client():
    client = MongoClient(settings.MONGO_URI)
    return client


def get_supabase_client():
    try:
        connection = psycopg2.connect(
            user=settings.SUPABASE_USER,
            password=settings.SUPABASE_PASSWORD,
            host=settings.SUPABASE_HOST,
            port=settings.SUPABASE_PORT,
            dbname=settings.DBNAME,
        )
        return connection

    except Exception as e:
        print(f"Failed to connect: {e}")


# cursor = connection.cursor()

# # select all
# cursor.execute("SELECT * FROM users;")
# rows = cursor.fetchall()
# for row in rows:
#     print(row)

# # select with filter
# cursor.execute("SELECT * FROM users WHERE email = %s;", ("test@example.com",))
# user = cursor.fetchone()
# print(user)

# # insert
# cursor.execute(
#     "INSERT INTO users (first_name, last_name, email) VALUES (%s, %s, %s);",
#     ("John", "Doe", "john@example.com")
# )
# connection.commit()

# # update
# cursor.execute(
#     "UPDATE users SET last_name = %s WHERE email = %s;",
#     ("Smith", "john@example.com")
# )
# connection.commit()

# # delete
# cursor.execute("DELETE FROM users WHERE email = %s;", ("john@example.com",))
# connection.commit()

# # drop table
# cursor.execute("DROP TABLE IF EXISTS users;")
# connection.commit()

# # create table
# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS users (
#         id SERIAL PRIMARY KEY,
#         first_name VARCHAR(50),
#         last_name VARCHAR(50),
#         email VARCHAR(100) UNIQUE
#     );
# """)
# connection.commit()

# # truncate table
# cursor.execute("TRUNCATE TABLE users RESTART IDENTITY;")
# connection.commit()

# cursor.close()


# supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# # select all
# response = supabase.table("users").select("*").execute()
# print(response.data)

# # select with filter
# response = supabase.table("users").select("*").eq("email", "test@example.com").execute()
# print(response.data)

# # insert
# response = supabase.table("users").insert({
#     "first_name": "John",
#     "last_name": "Doe",
#     "email": "john@example.com"
# }).execute()
# print(response.data)

# # update
# response = supabase.table("users").update({
#     "last_name": "Smith"
# }).eq("email", "john@example.com").execute()
# print(response.data)

# # delete
# response = supabase.table("users").delete().eq("email", "john@example.com").execute()
# print(response.data)

# # error check
# if response.error:
#     print("Error:", response.error)
# else:
#     print("Success:", response.data)
