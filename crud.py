"""CRUD operations."""

from model import db, User, Entry, MoodRating, Prompt, Habit, Countdown, connect_to_db
from sqlalchemy import extract


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


def get_user_by_id(id):
    """Return a user by primary key."""

    return User.query.get(id)


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()


def create_entry(journal_text, entry_date, created_ts, user_id):
    """Create and return a new journal entry."""

    journal_entry = Entry(
        journal_text=journal_text,
        entry_date=entry_date,
        created_ts=created_ts,
        user_id=user_id
    )

    return journal_entry


def get_entry(user_id, entry_date):
    """Get an entry."""

    return Entry.query.filter(Entry.user_id == user_id, Entry.entry_date == entry_date).first()


def create_mood_rating(mood_rating, rating_date, user_id):
    """Create and return a user's mood rating."""

    mood_rated = MoodRating(
        mood_rating=mood_rating,
        rating_date=rating_date,
        user_id=user_id
    )

    return mood_rated


def get_ratings(user_id, year, month):
    """Get mood rating."""
    
    return MoodRating.query.filter(
        MoodRating.user_id == user_id,
        extract('year', MoodRating.rating_date) == year,
        extract('month', MoodRating.rating_date) == month).all()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)