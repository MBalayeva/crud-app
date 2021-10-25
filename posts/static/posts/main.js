const postBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBox = document.getElementById('load-box')
const loadBtn = document.getElementById('load-btn')
const alertBox = document.getElementById('alert-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrfPost = document.getElementsByName('csrfmiddlewaretoken')[0].value

const url = window.location.href

let visible = 3

// csrf token for ajax

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const toggleLikesPost = () => {
    const toggleLikesForms = [...document.getElementsByClassName('toggle-likes-form')]

    toggleLikesForms.forEach((form) => {
        const postId = form.getAttribute('data-form-id')
        const toggleLikesBtn = document.getElementById(`toggle-like-${postId}`)
        
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            $.ajax({
                type: 'post',
                url: '/toggle-likes/',
                data: {
                    'csrfmiddlewaretoken': csrftoken,
                    'pk': postId
                },
                success: (res) => {
                    toggleLikesBtn.textContent = res.liked ? `Unlike (${res.likesCount})` : `Like (${res.likesCount})`
                },
                error: (error) => {
                    console.log(error)
                }
            })
        })
    })
}

const loadData = () => {
    $.ajax({
        type: 'get',
        url: `/posts_data/${visible}`,
        success: (res) => {
            const data = res.data
            setTimeout(() => {
                spinnerBox.classList.add('not-visible')
                data.forEach(post => {
                postBox.innerHTML += `<div class="card mt-3">  
                                        <div class="card-body">
                                            <h5 class="card-title">${post.title}</h5>
                                            <p class="card-text">${post.body}</p>
                                        </div>
                                        <div class="card-footer">
                                            <div class="d-flex">
                                                <a href="${url}post/${post.id}" class="btn btn-primary">Details</a>
                                                <form class="toggle-likes-form" data-form-id="${post.id}">
                                                    <button id="toggle-like-${post.id}" class="btn btn-primary d-inline-block mx-2">
                                                        ${post.liked ? `Unlike (${post.likes_count})` : `Like (${post.likes_count})`}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>` 
                });

                toggleLikesPost()
            
                if(res.size === 0) {
                    loadBox.innerHTML = '<p class="border border-primary text-primary rounded p-3 d-inline-block">No posts have been loaded yet...</p>'
                }

                else if(res.size <= visible) {
                    loadBox.innerHTML = '<p class="border border-primary text-primary rounded p-3 d-inline-block">No more posts to load...</p>'
                } 
            }, 100)
        },
        error: (error) => {
            console.log(error)
        }
    })
}

loadBtn.addEventListener('click', () => {
    visible += 3
    spinnerBox.classList.remove('not-visible')
    loadData()
})


postForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrfPost,
            'title': title.value,
            'body': body.value
        },
        success: (res) => {
            postBox.insertAdjacentHTML('afterbegin', `
            <div class="card mt-3">  
                <div class="card-body">
                    <h5 class="card-title">${res.title}</h5>
                    <p class="card-text">${res.body}</p>
                </div>
                <div class="card-footer">
                    <div class="d-flex">    
                        <a href="${url}post/${res.id}" class="btn btn-primary">Details</a>
                        <form class="toggle-likes-form" data-form-id="${res.id}">
                            <button id="toggle-like-${res.id}" class="btn btn-primary d-inline-block mx-2">
                                Like (0)
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            `)

            toggleLikesPost()

            handleAlerts('success', 'Post has been successfully created')
            setTimeout(() => {
                $('#alert-modal').fadeOut()
            }, 1000)
            $('#addPostModal').modal('hide')

            postForm.reset()
        },
        error: (err) => {
            console.log(err)
        }
    })
})

const deleted = localStorage.getItem('title')

if(deleted) {
    handleAlerts('danger', `${deleted} has been successfully deleted`)
    setTimeout(() => {
        $('#alert-modal').fadeOut()
    }, 2000)
    localStorage.clear()
}

loadData()