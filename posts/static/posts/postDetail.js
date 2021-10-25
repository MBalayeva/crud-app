const backBtn = document.getElementById('back-btn')
const deleteBtn = document.getElementById('delete-btn')
const updateBtn = document.getElementById('update-btn')
const spinnerBox = document.getElementById('spinner-box')
const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')
const updateForm = document.getElementById('update-post-form')
const deleteForm = document.getElementById('delete-post-form')
const alertBox = document.getElementById('alert-box')

const csrfUpdate = document.getElementsByName('csrfmiddlewaretoken')[0].value

const url = window.location.href + "/data"
const updateUrl = window.location.href + "/update"
const deleteUrl = window.location.href + "/delete"

backBtn.addEventListener('click', () => {
    history.back()
})

$.ajax({
    type: 'GET',
    url: url,
    success: (res) => {
        spinnerBox.classList.add('not-visible')

        if(res.logged_in !== res.author) {
            console.log("differ")
        } else {
            deleteBtn.classList.remove('not-visible')
            updateBtn.classList.remove('not-visible')
        }

        const postTitle = document.createElement("h3")
        const bodyPost = document.createElement('p')

        postTitle.setAttribute('class', 'mt-3')
        postTitle.setAttribute('id', 'post-title')
        bodyPost.setAttribute('class', 'mt-1')
        bodyPost.setAttribute('id', 'post-body')

        postTitle.textContent = res.title
        bodyPost.textContent = res.body

        document.getElementById('title-wrapper').appendChild(postTitle)
        document.getElementById('body-wrapper').appendChild(bodyPost)

        titleInput.value = res.title
        bodyInput.value = res.body
    },
    error: (err) => {
        console.log(err)
    }
})

updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const postTitle = document.getElementById('post-title')
    const postBody = document.getElementById('post-body')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            "csrfmiddlewaretoken": csrfUpdate,
            "title": titleInput.value,
            "body": bodyInput.value
        },
        success: (res) => {
            postTitle.textContent = res.newTitle
            postBody.textContent = res.newBody

            handleAlerts('success', 'Post has been successfully updated')
            setTimeout(() => {
                $('#alert-modal').fadeOut()
            }, 2000)
            $('#updatePostModal').modal('hide')
        },
        error: (err) => {
            console.log(err)
        }
    })
})

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            "csrfmiddlewaretoken": csrfUpdate,
        },
        success: (res) => {
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: (err) => {
            console.log(err)
        }
    })
})

console.log(titleInput.value)