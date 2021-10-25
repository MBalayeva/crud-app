from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User, related_name="liked_posts+", blank=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def likes_count(self):
        return self.liked.all().count()

    class Meta:
        ordering = ['-created_at']
