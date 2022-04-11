"""CRUD operations."""

from model import db, User, Entry, MoodRating, Prompt, Goal, Habit, CompletedHabit, Countdown, connect_to_db
from sqlalchemy import extract
from model import db

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

    return Entry.query.filter(
        Entry.user_id == user_id,
        Entry.entry_date == entry_date).first()


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


def create_goal(description, sort_goal, user_id):
    """Create and return a user's goal."""

    goal = Goal(
        description=description,
        sort_goal=sort_goal,
        user_id=user_id
    )

    return goal


def get_goal(user_id):
    """Get goal."""
    
    return Goal.query.filter(
        Goal.user_id == user_id).first()


def create_habit(text, frequency, sort_habit, user_id):
    """Create and return a user's habit."""

    habit = Habit(
        text=text,
        frequency=frequency,
        sort_habit=sort_habit,
        user_id=user_id
    )

    return habit


def get_habits(user_id):
    """Get habit."""
    
    return Habit.query.filter(
        Habit.user_id == user_id).all()


def get_habit(habit_id):
    return Habit.query.get(habit_id)


def create_completed_habit(date, habit_id):

    completed_habit = CompletedHabit(
        date=date,
        habit_id=habit_id
    )

    return completed_habit


def get_completed_habit(date, habit_id):

    return CompletedHabit.query.filter(
        CompletedHabit.habit_id == habit_id,
        CompletedHabit.date == date).first()


def get_weekly_completed_habits(user_id, start_date, end_date):

    return db.session.query(Habit, CompletedHabit).filter(
        Habit.user_id == user_id,
        Habit.id == CompletedHabit.habit_id,
        CompletedHabit.date >= start_date,
        CompletedHabit.date <= end_date
        ).all()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)