from django.urls import path 
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [ 
    path("", views.index, name="index"),
    path('login', views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("create", views.createQuiz, name="createQuiz"),
    path("profile", views.profileRender, name="profileRender"),
    path('allprojects', views.allprojects, name="allProjects"),
    path("quiz/<str:name>", views.getQuiz, name="getQuiz"),

    # API routes 
    path('profile/<str:username>', views.profile, name="profile"),
    path('quizzes', views.quizzes, name="quizzes"),
    path('quizAPI/<str:name>', views.quiz, name="quiz")
]
if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)