from .models import Profile, User

def add_variable_to_context(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return {
            'profile' : 'none'
        }
    try:
        profile = Profile.objects.get(user=user)
        return {
            'profile':profile
        }
    except Profile.DoesNotExist:
        return {
            'profile': 'none'
        }