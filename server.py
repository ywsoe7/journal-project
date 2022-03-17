"""Server for journaling app."""

from flask import Flask, render_template, request, flash, session, redirect
from model import connect_to_db, db
import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


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
        session["user_email"] = user.email
        flash(f"Welcome back, {user.fname}!")

    return redirect("/profile")


@app.route("/profile")
def profile_page():

    return render_template("profile_page.html")


@app.route("/journal")
def journal_page():

    return render_template("journal_page.html")


@app.route("/journal-entry", methods=["POST"])
def journal_entry_page():
    """Save a journal entry."""

    journal_text = request.form.get("journal_text")
    entry_date = request.form.get("entry_date")
    user_id = session["user_id"]

    entry = crud.create_entry(journal_text, entry_date, user_id)

    db.session.add(entry)
    db.session.commit()

    return redirect("/journal")


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
