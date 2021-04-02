import {getUser, getRepositories, getLanguages } from "./user-service-slow";



export const snoopUser = (username, response) => {
    (async() => {
        const githubUser = await getUser(username)
        const githubRepositories = await getRepositories(username, githubUser.public_repos)
        let data = generateSnoopData(githubUser)
        data.repositories = await generateRepositories(username, githubRepositories, data)
        response.json(data)
    })()
}



const generateSnoopData = githubUser => {
    return {
        name: githubUser.name,
        company: githubUser.company,
        blog: githubUser.blog,
        location: githubUser.location,
        hireable: githubUser.hireable,
        bio: githubUser.bio,
        email: githubUser.email,
        twitter_username: githubUser.twitter_username,
        information: {
            username: githubUser.login,
            avatar: githubUser.avatar_url,
            profile: githubUser.html_url,
            id: githubUser.id,
            node_id : githubUser.node_id,
            type: githubUser.type,
            site_admin: githubUser.site_admin,
            creation_date: (githubUser.created_at).substr(0, 10),
            update_date: (githubUser.updated_at).substr(0, 10),
        },
        statistics: {
            repositories: githubUser.public_repos,
            gists: githubUser.public_gists,
            followers: githubUser.followers,
            following: githubUser.following,
            stars: 0,
            forks: 0,
            languages: 0,
            disk_usage: 0,
            days_since_creation: calculateDays(githubUser.created_at),
            days_since_update: calculateDays(githubUser.updated_at),
        },
        languages: [],
        repositories: []
    }
}

const calculateDays = date => {
    const dateString = date.substr(0, 10)
    const inputYear = parseInt(dateString.substr(0,4))
    const inputMonth = parseInt(dateString.substr(5, 2)) - 1
    const inputDay = parseInt(dateString.substr(8, 2))
    const inputDate = new Date(inputYear, inputMonth, inputDay)
    const currentDate = new Date();
    const differenceMilliseconds = currentDate.getTime() - inputDate.getTime()
    return Math.floor(differenceMilliseconds / 86400000)
}

async function generateRepositories(username, githubRepositories, data) {
    let repositories = []
    for(let x = 0; x < githubRepositories.length; x++) {
        const tempRepository = {
            name: githubRepositories[x].name,
            description: githubRepositories[x].name,
            link: githubRepositories[x].html_url,
            information: {
                id: githubRepositories[x].id,
                node_id: githubRepositories[x].node_id,
                // license: (githubRepositories[x].license).name,
                language: githubRepositories[x].language,
                creation_date: (githubRepositories[x].created_at).substr(0, 10),
                last_update_date: (githubRepositories[x].updated_at).substr(0, 10),
            },
            statistics: {
                size: githubRepositories[x].size,
                stars: githubRepositories[x].stargazers_count,
                watchers: githubRepositories[x].watchers_count,
                issues: githubRepositories[x].open_issues_count,
                forks: githubRepositories[x].forks_count,
            },
            languages: await generateLanguages(username, githubRepositories[x].name, data)
        }
        repositories.push(tempRepository)
        data.statistics.disk_usage += tempRepository.statistics.size
        data.statistics.stars += tempRepository.statistics.stars
        if(githubRepositories[x].fork) data.statistics.forks++

        // if(tempRepository.stars > data.highestStarred) data.highestStarred = tempRepository.stars
    }
    data.languages = reduceLanguages(data)
    return repositories
}

async function generateLanguages(username, name, data) {
    const githubLanguages = await getLanguages(username, name)
    const languageName = Object.keys(githubLanguages)
    const languageUsage = Object.values(githubLanguages)
    let languages = []
    for(let x = 0; x < languageName.length; x++) {
        const language = {
            language: languageName[x],
            usage: languageUsage[x]
        }
        languages.push(language)
        data.languages.push(language)
    }
    return languages
}

function reduceLanguages(data) {
    return data.languages.map(({ language }) => language)
        .filter((language, index, array) => array.indexOf(language) === index)
        .map(language => ({
            language,
            usage: data.languages.filter(entry => entry.language === language)
                .reduce((accum, { usage }) => accum + usage, 0)
        }));
}