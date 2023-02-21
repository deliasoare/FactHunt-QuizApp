
document.addEventListener('DOMContentLoaded', function() {
        fetch(`profile/${username}`)
        .then(response => response.json())
        
        .catch(e => {
            console.log(e);
        })
        .then(data => {
            document.querySelector('#photo').setAttribute('src', `media/${data.profilePic}`);
            document.querySelector('#usernameProfile').innerHTML = `<b>Username: ${data.username}</b>`;
            if (document.querySelector('#background').value === '') {
                if (data.backgroundChoices) {
                data.backgroundChoices.forEach(choice => {
                    const option = document.createElement('option');
                    option.setAttribute('value', choice);
                    if (choice === data.background) {
                        option.setAttribute('selected', 'selected');
                    }
                    option.innerHTML = choice;
                    document.querySelector('#background').append(option);
                })
                }
            }
            document.querySelector('#profilePoints').innerHTML = `Points accumulated: <b>${data.points}</b>`

            
        })
        document.querySelector('#background').onchange = function() {
            const background = this.value;
            fetch(`profile/${username}`, {
                method:"PUT",
                body:JSON.stringify({
                    background: background
                })
            })
            if (background === 'default')
                document.querySelector('#theme').setAttribute('href', Default)
            else
                document.querySelector('#theme').setAttribute('href', yellow)
        }

    })

