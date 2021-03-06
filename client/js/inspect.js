/* eslint-disable no-undef */
$('form').submit(() => {
    const username = $('form input').val()
    console.log(`examining ${username}`)

    fetch(`${USER_URL}/${username}`)
        .then(response => response.json()) // Returns parsed json data from response body as promise
        .then(data => {
            console.log(`Got data for ${username}`)
            console.log(data)

            $('.username').html(data.username)
            $('.full-name').html(data.name)
            $('.location').html(data.location)
            $('.email').html(data.email)
            $('.bio').html(data.bio)
            $('.avatar').attr("src", data.avatar_url)

            let titlesString = ''
            if(data.titles.length < 1) {
                $('.titles').html(`User has not titles`)
            }
            else {
                for(let x = 0; x < data.titles.length; x++) {
                    if(x === 0) {
                        titlesString += `${data.titles[x]}`
                    }
                    else {
                        titlesString += `, ${data.titles[x]}`
                    }
                }
                $('.titles').html(titlesString)
            }

            $('.favorite-language').html(data.favorite_language)
            $('.total-stars').html(data.total_stars)
            $('.most-starred').html(data.highest_starred)
            $('.public-repos').html(data.public_repos)
            $('.perfect-repos').html(data.perfect_repos)
            $('.followers').html(data.followers)
            $('.following').html(data.following)

            $('.error-container').addClass('invisible')
            $('.user-container').removeClass('invisible')
        })
        .catch(err => {
            console.log(`Error getting data for ${username}`)
            $('.error-container').removeClass('invisible')
            $('.user-container').addClass('invisible')
            $('#user-error').html(`Error fetching ${username}, are you sure they exist?`)
        })

    return false
})
