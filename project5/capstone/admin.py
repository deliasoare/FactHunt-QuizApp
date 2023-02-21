from django.contrib import admin
from .models import User, Quiz, Question, Answer, Profile
# Register your models here.
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Profile)