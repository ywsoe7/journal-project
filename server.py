"""Server for journaling app."""

from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import connect_to_db, db
import crud, random

from datetime import datetime, date, timedelta
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

PROMPTS = [
    "Prompt: Do your current friendships and relationships bring joy to you?",
    "Prompt: What was the best part about your day today?",
    "Prompt: Have trouble sleeping? What's keeping you up?",
    "Prompt: What are your plans for this weekend?",
    "Prompt: What is the last dream you remember?",
    "Prompt: What is your biggest regret?",
    "Prompt: What are you grateful for?",
    "Prompt: What was the worst part about your day today?"
]


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("login_page.html")
    

@app.route("/logout")
def logout():
    """Logout."""

    return redirect("/")


@app.route("/registration")
def registration():
    """View registration."""

    return render_template("registration.html")


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
        flash("The account associated with this email already exists.", 'saved')
    else:
        user = crud.create_user(fname, lname, email, password, phone)
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully! Please log in.", 'saved')

    return redirect("/")


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login."""

    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)

    if not user or user.password != password:
        flash("Please enter a valid email or password.", 'saved')

        return redirect("/")
    else:
        session["user_id"] = user.id
        session["user_fname"] = user.fname
        session["user_email"] = user.email
        flash(f"Welcome back, {user.fname}!", "saved")

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

    flash("Entry saved succesfully. Way to go!", "saved")

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

    flash("Mood successfully saved for today!", 'saved')

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
    
    return random.choice(PROMPTS)


@app.route("/habits.json")
def habits_json():
    user_id = session["user_id"]

    today = date.today()
    index_of_day = today.weekday()

    start_date = today - timedelta(days = index_of_day)
    end_date = today + timedelta(days = 6 - index_of_day)

    tuples = crud.get_weekly_completed_habits(user_id, start_date, end_date)
    completions = {}

    for habit, completed_habit in tuples:
        if habit.id in completions:
            completions[habit.id].append(DAYS_OF_WEEK[completed_habit.date.weekday()])
        else:
            completions[habit.id] = [DAYS_OF_WEEK[completed_habit.date.weekday()]]

    result = []

    habits = crud.get_habits(user_id)

    for habit in habits:
        result.append({
            "id": habit.id,
            "habit": habit.text,
            "frequency": habit.frequency,
            "completions": completions.get(habit.id, [])
            })

    return jsonify(result)


@app.route("/habits")
def get_habits():
    return render_template("habits_page.html")


@app.route("/habits", methods=["POST"])
def create_habit():
    """View habits page."""

    user_id = session["user_id"]
    text = request.get_json().get("habit")
    frequency = request.get_json().get("frequency")

    habit = crud.create_habit(text, frequency, None, user_id)

    db.session.add(habit)
    db.session.commit()

    return jsonify({"id": habit.id})


@app.route("/habits/<habit_id>", methods=["PUT"])
def update_habit(habit_id):
    habit  = crud.get_habit(habit_id)

    habit.text = request.get_json().get("habit")
    habit.frequency = request.get_json().get("frequency")

    db.session.commit()

    return jsonify({"id": habit.id})

@app.route("/habits/<habit_id>", methods=["DELETE"])
def delete_habit(habit_id):
    habit  = crud.get_habit(habit_id)
    crud.delete_completed_habits(habit_id)

    db.session.delete(habit)
    db.session.commit()

    return jsonify({"id": habit.id})


@app.route("/completeHabit/<habit_id>", methods=["PUT"])
def toggle_habit_completion(habit_id):
    day = request.get_json().get("value")
    
    index_of_day = DAYS_OF_WEEK.index(day)

    today = date.today()
    current_index = today.weekday()

    difference = index_of_day - current_index
    toggle_date = today + timedelta(days=difference)
    
    is_completed = request.get_json().get("checked")

    completion = crud.get_completed_habit(toggle_date, habit_id)

    if is_completed and not completion:
        completion = crud.create_completed_habit(toggle_date, habit_id)
        db.session.add(completion)
    else:
        db.session.delete(completion)

    db.session.commit()

    return jsonify({"id": completion.id})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
