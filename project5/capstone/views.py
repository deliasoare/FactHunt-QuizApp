from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate ,login, logout
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.db import IntegrityError
from .models import User, Profile, Quiz, BACKGROUND, Question, Answer
import json
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize

# Create your views here.

def index(request):
    return render(request, "capstone/index.html")

def allprojects(request):
    quizzes = Quiz.objects.all()
    return render(request, "capstone/allprojects.html", {
        "quizzes":quizzes
    })

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "capstone/login.html", {
                "message": "Invalid username and/or password"
            })
    else:
        return render(request, "capstone/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if not request.FILES.get('picture'):
            picture = None
        else:
            picture = request.FILES['picture']
        if password != confirmation:
            return render(request, "capstone/register.html", {
                "message": "Passwords must match."
            })
        if not username or not password or not confirmation:
            return render(request, "capstone/register.html", {
                "message":"You must fill out all fields!"
            })
        
        try: 
            user = User.objects.create_user(username=username, password=password)
            if picture:
                profile = Profile.objects.create(user=user, profilePic=picture)
            else:
                profile = Profile.objects.create(user=user)
        except IntegrityError:
            return render(request, "capstone/register.html", {
                "message":"Username already taken!"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "capstone/register.html")

def logout_view(request):
    logout(request) 
    return HttpResponseRedirect(reverse("index"))

@login_required
def createQuiz(request):
    if request.method == "GET":
        return render(request, "capstone/createQuiz.html")


@csrf_exempt
def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status = 404)
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "Profile not found"}, status = 404)

    if request.method == "GET":
        return JsonResponse(profile.serializer())

    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("background") is not None:
            for i in range(len(BACKGROUND)):
                if data.get("background") == BACKGROUND[i][0]:
                    profile.preferenceBg = BACKGROUND[i][0]
                    profile.save()
        return HttpResponse(status=204)
    elif request.method == "POST":
        data = json.loads(request.body)
        if data.get("points") is not None:
            profile = Profile.objects.get(user=request.user)
            profile.points += data.get('points')
            profile.save()
        return JsonResponse({"message": "Successfully delivered"}, status = 201)
    else:
        return JsonResponse({"message":"Wrong method applied"}, status =400)

def profileRender(request):
    if request.method == "GET":
        return render(request, "capstone/profile.html")

@csrf_exempt
def quizzes(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get("name") is not None:
            quizzes = Quiz.objects.all()
            for quiz in quizzes:
                if (quiz.name == data.get("name")):
                    return JsonResponse({"message" :"Name"}, status=400)
            if data.get("name") == '':
                return JsonResponse({"message":"None"}, status=404)
        if data.get("questions") is not None and data.get("name") is not None:
            quiz = Quiz()
            questions = data.get("questions")
            quiz.name = data.get("name")
            quiz.creator = request.user
            quiz.save()
            for question in questions:
                questionModel = Question()
                questionModel.inquiry = question['prompt']
                questionModel.save()
                for answer in question['answers']:
                    answerModel = Answer()
                    answerModel.subject = answer['prompt']
                    answerModel.result = answer['result']
                    questionModel.save()
                    answerModel.save()
                    questionModel.answers.add(answerModel)
                quiz.questions.add(questionModel)
            return JsonResponse({"message" :"Questions sent successfully!"}, status=201)
        return JsonResponse({"message" :"Data was not rendered"}, status=400)
    else:
        return HttpResponse("got")

def getQuiz(request, name):
    quiz = Quiz.objects.get(name=name)
    return render(request, "capstone/quiz.html", {
        "quiz":quiz
    })

def quiz(request, name): 
    if request.method == "GET":
        try:
            quiz = Quiz.objects.get(name=name)
        except Quiz.DoesNotExist:
            return JsonResponse({"error":"Quiz not found"}, status=404)

        return JsonResponse(quiz.serializer())
    else:
        return JsonResponse({"error":"GET request required."}, status=400)

