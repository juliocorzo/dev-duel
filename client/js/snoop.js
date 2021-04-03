$('form').submit(() => {
    const username = $('form input').val()
    console.log(`examining ${username}`)

    fetch(`${SNOOP_URL}/${username}`)
        .then(response => response.json())
        .then(user => {
            console.log(`Got data for ${username}`)
            console.log(user)

            // Sets welcome message and links the snooped username to the actual GitHub profile.
            const welcome =
                `<h3>Here's the information for GitHub user 
                <strong><a href="${user.information.profile}" target=”_blank”>${username}</a></strong></h3>
                <p>It was all obtained using GitHub's public API, so nothing malicious is going on. You're only seeing 
                what the user wants you to see, plus some stuff that <em>is</em> public, although harder to find out 
                without getting the information from the API.</p>`
            $('#user-welcome').html(welcome)

            generateBasicInformation(user)
            generateGithubInformation(user)
            generateGithubStatistics(user.statistics)



            $('.snoop-container').removeClass('invisible')
        })

    return false
})

const generateBasicInformation = user => {
    let basicInformation = ''
    basicInformation += checkNull(user.name, 'Real name')
    basicInformation += checkNull(user.location, 'Location')
    basicInformation += checkNull(user.company, 'Company')
    basicInformation += checkNull(user.hireable, 'Hireable')
    basicInformation += checkNull(user.bio, 'Bio')
    basicInformation += checkNull(user.email, 'Email')
    basicInformation += checkNull(user.twitter_username, 'Twitter')
    $('.basic-information').html(basicInformation)
}

const generateGithubInformation = user => {
    let information = ''
    information += checkNull(user.information.username, 'Username')
    information += generateLink(user.information.avatar, 'Avatar')
    information += generateLink(user.information.profile, 'Profile')
    information += generateCode(user.information.id, 'ID')
    information += generateCode(user.information.node_id, 'Node ID')
    information += checkNull(user.information.type, 'Type')
    information += generateCode(user.information.site_admin, 'Site admin')
    information += checkNull(user.information.creation_date, 'Creation date')
    information += checkNull(user.information.update_date, 'Update date')
    $('.github-information').html(information)
}

const generateGithubStatistics = statistics => {
    let information = ''
    information += checkNull(statistics.repositories, 'Repositories')
    information += checkNull(statistics.gists, 'Gists')
    information += checkNull(statistics.followers, 'Followers')
    information += checkNull(statistics.following, 'Following')
    information += checkNull(statistics.stars, 'Stars')
    information += checkNull(statistics.forks, 'Forks')
    information += checkNull(statistics.languages, 'Languages')
    information += checkNull(statistics.disk_usage, 'Disk usage')
    information += checkNull(statistics.days_since_creation, 'Days since creation')
    information += checkNull(statistics.days_since_update, 'Days since update')
    $('.github-statistics').html(information)
}

const generateCode = (code, tag) => {
    let parsed = `<div class="row mb-0"><div class="col-sm-5"><p>${tag}</p></div>`
    if(code === null) {
        parsed += `<div class="col-sm-6"><p>Unavailable</p></div>`
    }
    else {
        parsed += `<div class="col-sm-6"><code>${code}</code></div>`
    }
    parsed += `</div>`
    return parsed
}

const generateLink = (link, tag) => {
    let parsed = `<div class="row mb-0"><div class="col-sm-5"><p>${tag}</p></div>`
    if(link === null) {
        parsed += `<div class="col-sm-6"><p>Unavailable</p></div>`
    }
    else {
        parsed += `<div class="col-sm-6"><a href=${link} target=”_blank”">Link</a></div>`
    }
    parsed += `</div>`
    return parsed
}

const checkNull = (information, tag) => {
    let parsed = `<div class="row mb-0"><div class="col-sm-5"><p>${tag}</p></div>`
    if(information === null) {
        parsed += `<div class="col-sm-6"><p>Unavailable</p></div>`
    }
    else {
        parsed += `<div class="col-sm-6"><p>${information}</p></div>`
    }
    parsed += `</div>`
    return parsed
}