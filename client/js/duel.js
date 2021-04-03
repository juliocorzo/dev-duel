/* eslint-disable no-undef */

$('form').submit(function() {
    const request = $(this).serialize();
    fetch(`${USERS_URL}?${request}`)
        .then(response => response.json())
        .then(users => {
            const left = users[0]
            const right = users[1]

            populatePage(left, right)
            chooseWinner(left, right)

            $('.duel-container').removeClass('invisible')
            $('.error-container').addClass('invisible')
        })
        .catch(err => {
            console.log(`Error getting data for ${request}`)
            console.log(err)
            $('.duel-container').addClass('invisible')
            $('.winner-container').addClass('invisible')
            $('.error-container').removeClass('invisible')
            $('#user-error').html(`Error fetching the usernames, are you sure they exist?`)
        })
    return false
})

const populatePage = (left, right) => {
    $('.left .username').html(left.username)
    $('.right .username').html(right.username)
    $('.left .full-name').html(left.name)
    $('.right .full-name').html(right.name)
    $('.left .location').html(left.location)
    $('.right .location').html(right.location)
    $('.left .email').html(left.email)
    $('.right .email').html(right.email)
    $('.left .bio').html(left.bio)
    $('.right .bio').html(right.bio)
    $('.left .avatar').attr("src", left.avatar_url)
    $('.right .avatar').attr("src", right.avatar_url)
    $('.left .titles').html(fixTitles(left.titles))
    $('.right .titles').html(fixTitles(right.titles))
    $('.left .favorite-language').html(checkNull(left.favorite_language))
    $('.right .favorite-language').html(checkNull(right.favorite_language))
    $('.left .total-stars').html(left.total_stars)
    $('.right .total-stars').html(right.total_stars)
    $('.left .most-starred').html(left.highest_starred)
    $('.right .most-starred').html(right.highest_starred)
    $('.left .public-repos').html(left.public_repos)
    $('.right .public-repos').html(right.public_repos)
    $('.left .perfect-repos').html(left.perfect_repos)
    $('.right .perfect-repos').html(right.perfect_repos)
    $('.left .followers').html(left.followers)
    $('.right .followers').html(right.followers)
    $('.left .following').html(left.following)
    $('.right .following').html(right.following)
}

const checkNull = data => {
    if(data === null) {
        return 'null'
    }
    return data
}

const fixTitles = titles => {
    let titlesString = ''
    if(titles.length < 1) {
        return 'User has no titles.'
    }
    else {
        for(let x = 0; x < titles.length; x++) {
            if(x === 0) {
                titlesString += `${titles[x]}`
            }
            else {
                titlesString += `, ${titles[x]}`
            }
        }
        return titlesString
    }
}

const chooseWinner = (left, right) => {
    let duelWinner = left.username
    if(Math.floor(Math.random() * 2) === 0) {
        duelWinner = right.username
    }

    $('#winner-name').html(`Congratulations <strong>${duelWinner}</strong>, you are the winner!`)
    $('.winner-container').removeClass('invisible')
    $('.error-container').addClass('invisible')
}

/*
  TODO
  Fetch 2 user's github data and display their profiles side by side
  If there is an error in finding user or both users, display appropriate error
  message stating which user(s) doesn't exist

  It is up to the student to choose how to determine a 'winner'
  and displaying their profile/stats comparison in a way that signifies who won.
 */
