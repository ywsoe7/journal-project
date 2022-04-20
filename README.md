# YS Journal
YS Journal (Your Simple Journal) is a web app built to make it easy for users to add, edit and view a journal entry. In addition, users can track their moods and habits daily with just a few simple clicks. They can track their daily mood by clicking on a mood emoji which saves the data in the PostgreSQL database and displayed for the current date on the JavaScript calendar. By clicking on a date, users will be able to write or update their entries where randomized prompts can also be generated into the journal text area. Users can also track their daily habits on a page built using React. They can add, edit or delete habits including the frequency of habit for each week and use the check boxes to track progress for each completed habit.
![YS Journal Homepage](/static/img/homepage.png)


## Table of Contents
* [Technologies Used](#technologiesused)
* [How to locally run YS Journal](#run)
* [How to use YS Journal](#use)

## <a name="technologiesused"></a>Technologies Used

* Python
* Flask
* Jinja
* JavaScript
* AJAX
* JSON
* React
* ReactBootstrap
* Bootstrap
* HTML
* CSS
* SQL
* SQLAlchemy
* PostgreSQL

(dependencies are listed in requirements.txt)

## <a name="run"></a>How to locally run YS Journal

Here is how to run YS Journal locally on your machine.

### Run the There and Back Again Flask App

  * Set up and activate a python virtualenv, and install all dependencies:
    * `virtualenv env`
    * `source env/bin/activate`
    * `pip3 install -r requirements.txt`
  * Make sure you have PostgreSQL running. Create a new database in psql named users:
  	* `createdb users;`
  * Create the tables in your database:
    * `python3 -i model.py`
    * While in interactive mode, create tables: `db.create_all()`
  * Now, quit interactive mode. Start up the flask server:
    * `python3 server.py`
  * Go to localhost:5000 to see the web app


## <a name="use"></a>How to use YS Journal

### Profile Page
Click on an emoji that reflects your mood for the day. Select any date on the calendar to begin writing an entry.

![YS Journal Profile Page](//static/img/profile.png)

### Journal Page
Start writing your entry in the textarea. Click on `Get a Prompt` button to randomly generate a prompt in the journal.

![YS Journal Journal Page](//static/img/journal.png)

### Habits Page
Add, update or delete habits. Click on the checkboxes to track daily habits. The checkboxes will refresh weekly on Monday.

![YS Journal Habits Page](//static/img/habits.png)

## <a name="author"></a>Author
Yoon Soe is a software engineer in San Francisco Bay Area.