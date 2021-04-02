import {getUser, getRepositories} from "./user-service-slow";

/**
 * Implements the `GET /user/:username` endpoint. Generates user data and returns it to the client.
 *
 * @param username of the GitHub user we are generating a response for.
 * @param response how the generated data is sent back to the client.
 */
export const generateUserFast = (username, response) => {
    (async() => {
        const githubUser = await getUser(username)
        const githubRepositories = await getRepositories(username, githubUser.public_repos)
        let data = generateDataFast(githubUser)
        data.repositories = await generateRepositoriesFast(username, githubRepositories, data)
        const user = generateResponseBodyFast(data)
        response.json(user)
    })()
}

/**
 * Implements the `GET /users/` endpoint. Generates user data and returns it to the client.
 *
 * @param usernames the array of usernames we are generating values of.
 * @param response how the users are returned to the client
 */
export const generateUsersFast = (usernames, response) => {
    (async() => {
        const queryUsernames = usernames.username
        let users = []
        for(let x = 0; x < queryUsernames.length; x++) {
            const username = queryUsernames[x]
            const githubUser = await getUser(username)
            const githubRepositories = await getRepositories(username, githubUser.public_repos)
            let data = generateDataFast(githubUser)
            data.repositories = await generateRepositoriesFast(username, githubRepositories, data)
            const user = generateResponseBodyFast(data)
            users.push(user)
        }
        response.json(users)
    })()
}

/**
 * Organizes data to parse and iterate upon, this generates an object with the data used during user generation
 *
 * @param githubUser the github user we're storing the data for.
 * @returns See function to see what is being returned.
 */
function generateDataFast(githubUser) {
    return {
        username: githubUser.login,
        name: githubUser.name !== null ? githubUser.name : 'No name provided',
        location: githubUser.location !== null ? githubUser.location : 'No name provided',
        email: githubUser.email !== null ? githubUser.email : 'No email provided.',
        bio: githubUser.bio !== null ? githubUser.bio : 'No bio provided.',
        avatar_url: githubUser.avatar_url,
        public_repos: githubUser.public_repos,
        total_stars: githubUser.starCount,
        highest_starred: githubUser.highestStarred,
        perfect_repos: githubUser.perfectRepos,
        followers: githubUser.followers,
        following: githubUser.following,
        starCount: 0,
        highestStarred: 0,
        perfectRepos: 0,
        forkCount: 0,
        createdYear: parseInt((githubUser.created_at).substr(0, 4), 10),
        repositories: [],
        languages: []
    }
}

/**
 * Generates an array with relevant information from the user repositories and populates the data relevant
 * to the response. Mainly used for parsing and storing data, this array of objects is not directly sent back
 * to the client, rather, information derived from it is.
 *
 * @param username of the GitHub user
 * @param githubRepositories GitHub repositories of the GitHub user
 * @param data of the GitHub user
 * @returns {Promise<[]>} array of objects each representing a repository of the user.
 */
async function generateRepositoriesFast(username, githubRepositories, data) {
    let repositories = []
    for(let x = 0; x < githubRepositories.length; x++) {
        const tempRepository = {
            name: githubRepositories[x].name,
            forked: githubRepositories[x].fork,
            stars: githubRepositories[x].stargazers_count,
            issues: githubRepositories[x].open_issues_count,
            language: githubRepositories[x].language
        }
        data.languages.push(tempRepository.language)
        repositories.push(tempRepository)
        if(tempRepository.forked) data.forkCount++
        if(tempRepository.issues === 0) data.perfectRepos++
        data.starCount += tempRepository.stars
        if(tempRepository.stars > data.highestStarred) data.highestStarred = tempRepository.stars
    }
    return repositories
}

/**
 * Organizes the data we have stored from a user in the format that it needs to have before being sent back
 * to the client. Similar to generate data, but only with the relevant information for a response.
 * @param data
 * @returns see function for return type.
 */
function generateResponseBodyFast(data) {
    return {
        username: data.username,
        name: data.name,
        location: data.location,
        email: data.email,
        bio: data.bio,
        avatar_url: data.avatar_url,
        titles: generateTitlesFast(data),
        favorite_language: getFavoriteLanguage(data.languages),
        public_repos: data.public_repos,
        total_stars: data.starCount,
        highest_starred: data.highestStarred,
        perfect_repos: data.perfectRepos,
        followers: data.followers,
        following: data.following
    };
}

/**
 * Generates and returns a user's titles based on specific requirements:
 *
 * - Forker: If more than half of the user's repositories are forked from other repositories.
 * - One-Trick Pony: If all the repositories have the same top language.
 * - Jack of all Trades: If more than 10 languages are the top language of the users' repositories.
 * - Stalker: If the user follows more than twice as many users as the users following them.
 * - Mr. Popular: If the user is followed by more than twice of the users that they are following.
 * - Founder: If the account was created before or on 2009. GitHub was launched in 2008.
 * - Hatchling: If the account was created in 2021.
 * - One-Hit Wonder: If more than half of the user stars belong to a single repository.
 *
 * @param data of the user whose titles are being generated.
 * @returns [string]
 */
function generateTitlesFast(data) {
    let titles = []
    if(data.forkCount > data.repositories.length / 2) {
        titles.push('Forker')
    }
    if(getPony(data.languages)) {
        titles.push('One-Trick Pony')
    }
    if(getUniqueLanguages(data.languages).length > 10) {
        titles.push('Jack of all Trades')
    }
    if(data.following > data.followers * 2) {
        titles.push('Stalker')
    }
    if(data.followers > data.following * 2) {
        titles.push('Mr. Popular')
    }
    if(data.createdYear <= 2009) {
        titles.push('Founder')
    }
    else if(data.createdYear === 2021) {
        titles.push('Hatchling')
    }
    if(data.starCount * 0.5 < data.highestStarred) {
        titles.push('One-Hit Wonder')
    }
    return titles
}

/**
 * Returns true if the top language in every repository is the same, false otherwise,
 *
 * @param languages string array that contains the top languages from every repository.
 * @returns boolean
 */
function getPony(languages) {
    let pony = true
    if(languages.length === 0) {
        return pony
    }
    for(let x = 1; x < languages.length && pony; x++) {
        if(languages[x - 1] !== languages[x]) {
            pony = false
        }
    }
    return pony
}

/**
 * Filters the languages array so that there are no duplicates and returns the filtered version.
 *
 * @param languages string array that contains the top languages from every repository.
 * @returns [string]
 */
function getUniqueLanguages(languages) {
    return languages.filter((language, index, ar) => ar.indexOf(language) === index)
}

/**
 * Returns the language that is the most used in the greatest amount of repositories.
 *
 * @param languages string array that contains the top languages from every repository.
 * @returns string | null
 */
function getFavoriteLanguage(languages) {
    let compare = '';
    let mostFrequentLanguage = '';
    languages.reduce((acc, val) => {
        if(val in acc) {
            acc[val]++;
        }
        else {
            acc[val] = 1;
        }
        if(acc[val] > compare) {
            compare = acc[val];
            mostFrequentLanguage = val;
        }
        return acc;
    }, {})
    return mostFrequentLanguage
}