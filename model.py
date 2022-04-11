"""Models for journaling app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String(25))
    lname = db.Column(db.String(25))
    email = db.Column(db.String(25), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.String(20))

    entries = db.relationship("Entry", back_populates="user")
    mood_ratings = db.relationship("MoodRating", back_populates="user")
    goals = db.relationship("Goal", back_populates="user")
    habits = db.relationship("Habit", back_populates="user")
    countdowns = db.relationship("Countdown", back_populates="user")

    def __repr__(self):
        return f"<User id={self.id} fname={self.fname} lname={self.lname} email={self.email} password={self.password}>"
    

class Entry(db.Model):
    """A journal entry."""

    __tablename__ = "entries"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    journal_text = db.Column(db.Text)
    entry_date = db.Column(db.Date)
    created_ts = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="entries")

    def __repr__(self):
        return f"<Entry id={self.id} user_id={self.user_id} entry_date={self.entry_date}>"


class MoodRating(db.Model):
    """The mood of the user."""

    __tablename__ = "mood_ratings"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    mood_rating = db.Column(db.Integer)
    rating_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable= False)

    user = db.relationship("User", back_populates="mood_ratings")

    def __repr__(self):
        return f"<MoodRating id={self.id} mood_rating={self.mood_rating} rating_date={self.rating_date}>"


class Prompt(db.Model):
    """A prompt."""

    __tablename__ = "prompts"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    prompt_text = db.Column(db.Text)

    def __repr__(self):
        return f"<Prompt id={self.id} prompt_text={self.prompt_text}>"


class Goal(db.Model):
    """A goal."""

    __tablename__ = "goals"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    description = db.Column(db.Text)
    sort_goal = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable= False)

    user = db.relationship("User", back_populates="goals")

    def __repr__(self):
        return f"<Prompt id={self.id} description={self.description}>"


class Habit(db.Model):
    """A habit."""

    __tablename__ = "habits"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    text = db.Column(db.Text)
    frequency = db.Column(db.Integer)
    sort_habit = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable= False)

    user = db.relationship("User", back_populates="habits")
    completed_habits = db.relationship("CompletedHabit", back_populates="habits")

    def __repr__(self):
        return f"<Habit id={self.id} text={self.text} frequency={self.frequency}>"


class CompletedHabit(db.Model):
    """A completed habit."""

    __tablename__ = "completed_habits"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    date = db.Column(db.Date)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable= False)

    habits = db.relationship("Habit", back_populates="completed_habits")

    def __repr__(self):
        return f"<CompletedHabit id={self.id} date={self.date}>"


class Countdown(db.Model):
    """A countdown."""

    __tablename__ = "countdowns"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    set_content = db.Column(db.Text)
    countdown_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable= False)

    user = db.relationship("User", back_populates="countdowns")

    def __repr__(self):
        return f"<Countdown id={self.id} countdown_date={self.countdown_date}>"


def connect_to_db(flask_app, db_uri="postgresql:///users", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
