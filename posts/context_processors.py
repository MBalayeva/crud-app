from profiles.models import Profile
 
def get_profile_image(request):
    profile = Profile.objects.get(user=request.user)
    return {"user_img": profile.image.url}
