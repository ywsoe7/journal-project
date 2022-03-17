"""CRUD operations."""

from model import db, User, Entry, MoodRating, Prompt, Habit, Countdown, connect_to_db


def create_user(fname, lname, email, password, phone):
    """Create and return a new user."""

    user = User(
        fname=fname,
        lname=lname,
        email=email,
        password=password,
        phone=phone
    )

    return user


def get_user_by_id(user_id):
    """Return a user by primary key."""

    return User.query.get(user_id)


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()


def create_entry(journal_text, entry_date, user_id):
    """Create and return a new journal entry."""

    journal_entry = Entry(
        journal_text=journal_text,
        entry_date=entry_date,
        user_id=user_id,
    )

    return journal_entry


if __name__ == "__main__":
    from server import app

    connect_to_db(app)