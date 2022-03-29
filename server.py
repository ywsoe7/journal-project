"""Server for journaling app."""

from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import connect_to_db, db
import crud, random

from datetime import datetime
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


prompts = [
    "Prompt: Do your current friendships and relationships bring joy to you?",
    "Prompt: What was the best part about your day today?",
    "Prompt: What was the worst part about your day today?",
    "Prompt: Have trouble sleeping? What's keeping you up?",
    "Prompt: What are your plans for this weekend?",
    "Prompt: What is the last dream you remember?",
    "Prompt: What is your biggest regret?",
    "Prompt: What are you grateful for?"
]


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("homepage.html")


@app.route("/users", methods=["POST"])
def register_user():
    """Create a new user."""

    fname = request.form.get("fname")
    lname = request.form.get("lname")
    email = request.form.get("email")
    password = request.form.get("password")
    phone = request.form.get("phone")

    user = crud.get_user_by_email(email)

    if user:
        flash("The account associated with this email already exists.")
    else:
        user = crud.create_user(fname, lname, email, password, phone)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully! Please log in.")

    return redirect("/")


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login."""

    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)

    if not user or user.password != password:
        flash("Please enter a valid email or password.")

        return redirect("/")
    else:
        session["user_id"] = user.id
        session["user_fname"] = user.fname
        session["user_email"] = user.email
        flash(f"Welcome back, {user.fname}!")

    return redirect("/profile")


@app.route("/profile")
def profile_page():

    return render_template("profile_page.html")


@app.route("/journal")
def journal_page():

    return render_template("journal_page.html")


@app.route("/journal/<entry_date>", methods=["POST"])
def create_entry(entry_date):

    created_ts = datetime.now()
    journal_text = request.form.get("journal_text")
    user_id = session["user_id"]

    entry = crud.get_entry(user_id, entry_date)

    if entry:
        entry.journal_text = journal_text
    else:
        entry = crud.create_entry(journal_text, entry_date, created_ts, user_id)
        db.session.add(entry)

    db.session.commit()

    flash("Saved succesfully. Way to go!")

    return redirect(f'/journal?date={entry_date}')


@app.route("/journal/<entry_date>")
def get_entry(entry_date):

    user_id = session["user_id"]
    entry = crud.get_entry(user_id, entry_date)

    return entry.journal_text if entry else ""


@app.route("/profile/ratings/<mood_rating>")
def save_mood_rating(mood_rating):
    """Save user's rated mood each day."""

    rating_date = datetime.today()
    user_id = session["user_id"]

    rated = crud.create_mood_rating(mood_rating, rating_date, user_id)

    db.session.add(rated)
    db.session.commit()

    flash("Successfully saved your mood!")

    return render_template("/profile_page.html")


@app.route("/profile/ratings/<year>/<month>")
def get_ratings(year, month):

    user_id = session["user_id"]
    ratings = crud.get_ratings(user_id, year, month)

    rating_by_day = {}

    for rating in ratings:
        day = rating.rating_date.strftime("%d")
        rating_by_day[day] = rating.mood_rating   
        
    return jsonify(rating_by_day)


@app.route("/journal/prompts")
def get_prompts():
    
    return random.choice(prompts)


@app.route("/habits")
def habits():
    """View homepage."""

    return render_template("habits_page.html")


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
