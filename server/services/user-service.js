import axios from "axios";

export const generateUser = (username, response) => {

    (async() => {

        // Raw user and repository data is fetched and stored to avoid multiple recursive calls.
        let githubUser = await getUser(username)
        let githubRepositories = await getRepositories(username)

        // Generates data that will be useful or added upon during user generation.
        let data = generateData(githubUser)

        // Generates repository array with relevant information about each repository
        data.repositories = await generateRepositories(username, githubRepositories, data)

        let user =  {
            username: data.username,
            name: data.name,
            location: data.location,
            bio: data.bio,
            avatar_url: data.avatar_url,
            titles: generateTitles(data),                       // TODO Implement the remaining titles.
            favorite_language: getMostUsedLanguage(data.languageList),
            public_repos: data.public_repos,
            total_stars: data.starCount,
            highest_starred: data.highestStarred,
            perfect_repos: data.perfectRepos,
            followers: data.followers,
            following: data.following
        }
        response.json(user)
    })()
}

/**
 * Returns user object from GitHub's API.
 * @param username of the user that is being fetched.
 * @returns {Promise<any>} the user information being returned by GitHub
 */
async function getUser(username) {
    let user = await axios.get(`users/${username}`);
    return user.data
}

/**
 * Returns a user's repositories from GitHub's API as an array of objects.
 * @param username of the user whose repositories are being returned.
 * @returns {Promise<any>} repositories being returned.
 */
async function getRepositories(username) {
    let repositories = await axios.get(`users/${username}/repos`);
    return repositories.data;
}

async function getLanguages(username, repository) {
    let languages = await axios.get(`repos/${username}/${repository}/languages`)
    return languages.data
}

function generateData(githubUser) {
    return {
        username: githubUser.login,
        name: githubUser.name,
        location: githubUser.location,
        bio: githubUser.bio,
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
        languageList: [],
        ponies: []
    }
}



async function generateRepositories(username, githubRepositories, data) {
    let repositories = []
    for(let x = 0; x < githubRepositories.length; x++) {

        const languages = await generateLanguages(username, githubRepositories[x].name, data)


        // Parsed repository is generated and pushed to the repository array here.
        let tempRepository = {
            name: githubRepositories[x].name,
            forked: githubRepositories[x].fork,
            stars: githubRepositories[x].stargazers_count,
            issues: githubRepositories[x].open_issues_count,
            languages: languages
        }
        repositories.push(tempRepository)

        // Information relevant to titles is generated here.
        if(tempRepository.forked) data.forkCount++
        if(tempRepository.issues === 0) data.perfectRepos++
        data.starCount += tempRepository.stars
        if(tempRepository.stars > data.highestStarred) data.highestStarred = tempRepository.stars

    }

    data.languageList = reduceLanguages(data)
    data.ponies = getPonies(data)
    return repositories
}

async function generateLanguages(username, name, data) {
    // Gets the raw language values for each repository
    const githubLanguages = await getLanguages(username, name)

    // Gets the key, value pairs for each language in a repository
    const languageName = Object.keys(githubLanguages)
    const languageUsage = Object.values(githubLanguages)

    let languages = []

    for(let y = 0; y < languageName.length; y++) {
        let language = {
            language: languageName[y],
            usage: languageUsage[y],
            pony: 1
        }
        languages.push(language)
        data.languageList.push(language)
    }
    return languages
}

function reduceLanguages(data) {
    return data.languageList.map(({ language }) => language)
        // remove any duplicates
        .filter((language, index, array) => array.indexOf(language) === index)
        .map(language => ({
            language,
            // sum up the values where the language matches
            usage: data.languageList.filter(entry => entry.language === language)
                .reduce((accum, { usage }) => accum + usage, 0),
            pony: data.languageList.filter(entry => entry.language === language)
                .reduce((accum, { pony }) => accum + pony, 0) === data.public_repos
        }));
}

function getPonies(data) {
    let ponies = []
    for(let x = 0; x < data.languageList.length; x++) {
        if(data.languageList[x].pony) {
            ponies.push(data.languageList[x].language)
        }
    }
    return ponies
}

function getMostUsedLanguage(languages) {
    if(languages.length === 0) {
        return null
    }
    let mostUsed = languages[0]
    for(let x = 0; x < languages.length; x++) {
        if(mostUsed.usage < languages[x].usage) {
            mostUsed = languages[x]
        }
    }
    return mostUsed.language
}

function generateTitles(data) {
    let titles = []
    if(data.forkCount > data.repositories.length / 2) {
        titles.push('Forker')
    }
    if(data.ponies.length > 0) {
        titles.push('One-Trick Pony')
    }
    if(data.languageList.length > 10) {
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