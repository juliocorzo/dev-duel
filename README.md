# JavaScript Assignment - Dev Duel
# Assignment Overview

For this assignment, students are tasked with developing a small full-stack application that interfaces with 
[GitHub's API](https://developer.github.com/v3/) in order to aggregate, transform, and display a given user's profile 
and repository data.  

The assignment is composed of two independent pieces that make up a simple full-stack application.
	
1. A [Node](https://nodejs.org/en/docs/) **server** exposing an API using [Express](https://expressjs.com/en/api.html)
2. A Web-based **client** using [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML), 
   [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), 
   [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and [jQuery](https://api.jquery.com/)


This specification is split into multiple parts. 
- [Assignment Overview](README.md) - Gives a general overview of the assignment and technical requirements
- [Development](DEVELOPMENT.md) - Instructions on setting up development environment and servers
- [Client](client/README.md) - Requirements/Information specific to client-side web application implementation
- [Server](server/README.md) - Requirements/Information specific to Node API implementation

---

## Progress

1. Successfully added token, deleted supplementary files. 

## Fast and slow implementations

Fast implementation of the endpoints. Fast as in, less accurate and also more in line with what the original goal
was. Instead of going into every repository and fetching its languages, these endpoints use the most used
language in a repository as reported by GitHub.

Why is this more inaccurate? Instead of counting the total amount of code in a language a user has
submitted, it counts which is the most prominent language in each repository.

What is the difference? Let's say a random GitHub user has 100 repositories, one of which contains the entire source
code of Discord, a popular gaming messaging platform. Discord's desktop and web applications are written in React.js
and Electron.js, mostly JavaScript, and a lot of it.

The other 99 repositories contain Ruby code snippets, most with one file with two lines. The fast version of the
endpoint would report that Ruby is this user's favorite language, when it reality, it's Javascript, because its the
language that is most prominent down to the bits.


## Requirements Overview

Students will implement a web application along with a supporting API to get the following data for a given user's 
GitHub profile. The backend will be implemented as a Node API using Express that will call GitHub's API to fetch data 
necessary to derive/display the data specified. The user will see a home page where they can choose between two options:
**inspect** or **duel**.

### Profile

Profiles are displayed on both the **inspect** page and the **duel** page. Both pages display profiles the same way. 
They are composed of the same fields and there should be no differences between a `profile` displayed on either page.

All `profile`s displayed on the website will be composed of the following fields
- User's full name, location, bio, and avatar URL.
- Titles
    - **Forker** - 50% or more repositories are forked
    - **One-Trick Pony** - 100% of repositories use the same language
    - **Jack of all Trades** - Uses more than 10 languages across all repositories
    - **Stalker** - The number of people this user is `following` is at least double the number of `followers`
    - **Mr. Popular** - The number of `followers` this user has is at least double the number of `following`
    - One title of the student's choosing
- Favorite language (based on most used language used for public repositories)
- Total number of public repositories
- Total number of stars across all repositories
- Highest single repository star count
- Total number of 'perfect projects' (projects that have zero open issues)
- Total number of followers
- Total number of following

### Inspect
On the **inspect** page, a client will enter a username, submit, and be displayed the user's `profile` data.

### Duel
For the **duel** page, it is left up to the student to choose how a winner is determined. Two usernames will be entered, 
submitted, and their `profile` data displayed. Using the fields that are received from the API and displayed to the 
user, the student will need to visually signify differences in the data displayed as well as make an overall winner 
apparent to the user.

---

## As mentioned in the Assignment Overview at the top of this page, additional information and requirements for the server/client can be found in their respective folder's `README.md`.

#### [server/README.md](server/README.md)
#### [client/README.md](client/README.md)
