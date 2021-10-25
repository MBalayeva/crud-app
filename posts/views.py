from django.shortcuts import render
from .models import Post
from profiles.models import Profile
from .forms import PostForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


@login_required
def post_list_and_create(request):
    # posts = Post.objects.all()    
    form = PostForm(request.POST or None)
    if request.is_ajax():
        if form.is_valid():
            form.instance.author = Profile.objects.get(user = request.user)
            form.save()
            return JsonResponse({
                'title': form.instance.title,
                'body': form.instance.body,
                'author': form.instance.author.user.username,
                'id': form.instance.id,
            })
    context = {
        "form": form
    }
    return render(request, 'posts/main.html', context)


@login_required
def post_details_view(request, pk):
    post = Post.objects.get(pk=pk)
    post_form = PostForm(request.POST or None)

    context = {
        'post': post,
        'post_form': post_form
    }
    return render(request, 'posts/post-detail.html', context)


@login_required
def post_details_data_view(request, pk):
    post = Post.objects.get(pk=pk)

    data = {
        'title': post.title,
        'body': post.body,
        'author': post.author.user.username,
        'logged_in': request.user.username
    }

    return JsonResponse(data)


@login_required
def get_post_data_view(request, num_posts):
    upper = num_posts
    lower = upper - 3
    size = Post.objects.all().count()

    posts = Post.objects.all()
    data = []
    for post in posts:
        item = {
            "id": post.id,
            "title": post.title,
            "body": post.body,
            "liked": True if request.user in post.liked.all() else False,
            "likes_count": post.likes_count,
            "author": post.author.user.username
        }
        data.append(item)
    return JsonResponse({'data': data[lower:upper], 'size': size})


@login_required
def toggle_likes_post_view(request):
    post_id = request.POST.get('pk')
    post = Post.objects.get(id=post_id)

    if request.user in post.liked.all():
        liked=False
        post.liked.remove(request.user)
    else:
        liked=True
        post.liked.add(request.user)

    return JsonResponse({'liked': liked, 'likesCount': post.likes_count})


@login_required
def update_post(request, pk):
    post = Post.objects.get(pk=pk)

    if request.is_ajax():
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        post.title = new_title
        post.body = new_body
        post.save()

        return JsonResponse({
            'newTitle': new_title,
            "newBody": new_body
        })


@login_required
def delete_post(request, pk):
    post = Post.objects.get(pk=pk)

    if request.is_ajax():
        post.delete()
        return  JsonResponse({})

