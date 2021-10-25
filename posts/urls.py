from django.urls import path
from .views import (
    post_list_and_create,
    get_post_data_view,
    post_details_view,
    toggle_likes_post_view,
    post_details_data_view,
    update_post,
    delete_post
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name="main-page" ),
    path('post/<int:pk>', post_details_view, name="details-page" ),
    path('post/<int:pk>/update', update_post, name="update-post" ),
    path('post/<int:pk>/delete', delete_post, name="delete-post" ),

    path('toggle-likes/', toggle_likes_post_view, name="toggle-likes"),
    path('posts_data/<int:num_posts>', get_post_data_view, name="posts-data"),
    path('post/<int:pk>/data', post_details_data_view, name="details-data" )
]