$('form').submit(() => {
    const username = $('form input').val()
    console.log(`examining ${username}`)

    fetch(`${SNOOP_URL}/${username}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Got data for ${username}`)
            console.log(data)
        })

    return false
})