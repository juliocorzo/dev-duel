# Dev Duel

This is an archive of a project done during Cook System's FastTrack boot camp. To browse the rest of the projects, 
please visit my [FastTrack project on GitHub](https://github.com/users/juliocorzo/projects/1).

## Project overview

For this project, I was tasked with developing a small full-stack application that interfaces with [GitHub's API](https://developer.github.com/v3/)
 in order to aggregate, transform, and display a GitHub user's profile and repository data. 

The project is composed of two independent pieces, the front-end built using normal HTML, CSS, and JavaScript, and the 
back-end, consisting of a [Node](https://nodejs.org/en/docs/) server exposing an API using [Express](https://expressjs.com/en/api.html).

## Technologies used

- [NodeJS](https://nodejs.org/api/documentation.html)
- [Express](https://expressjs.com/en/4x/api.html) - Fast, unopinionated, minimalist web framework for Node.js
- [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and Node.js
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) - A popular framework for building websites.
- [nodemon](https://github.com/remy/nodemon#nodemon) - Watches code and restarts server
- [live-server](https://expressjs.com/en/4x/api.html) - Watches code and serves static files

## Running the project

Running the project requires access to the GitHub API, and as such, doing so might requires setting up a token. A live 
version of this project will be made available soon to see it in action.

### Back-end

The back-end part of this project consisted of implementing two endpoints, one that fetches GitHub user information for 
a single user and one that fetches the same information for many users. I also implemented a third endpoint that 
fetches more information on a user, some of which is hard to access without going through all the user's repos, for 
example, language usage by bits, and number of stars received on their repositories.

### Front-end

The front-end was implemented with jQuery, Bootstrap, and static HTML. Data was fetched from the back-end, and jQuery 
was used to present the client with relevant information on that user. Bootstrap's flex grid was used to display this 
information in an organized, responsive, and mobile-friendly way.
