from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.serializers import serialize

# Create your models here.
class User(AbstractUser):
    pass

BACKGROUND = [
    ("default", "default"),
    ("yellow", "yellow")
]

BackgroundChoices = ['default', 'yellow']


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="User")
    preferenceBg = models.CharField(max_length=10, choices=BACKGROUND, default="default")
    points = models.IntegerField(default=0)
    profilePic = models.ImageField(upload_to="media/", default='media/nophoto.jpg', blank=True)

    def serializer(self):
        return {
            "username":self.user.username,
            "background":self.preferenceBg,
            "backgroundChoices":BackgroundChoices,
            "profilePic":str(self.profilePic),
            "points":self.points,
        }
        
class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=64)
    result = models.BooleanField(default=False)

    class Meta:
        ordering = ['id', 'subject', 'result']

    def __str__(self):
        return self.subject

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    inquiry = models.CharField(max_length=64)
    answers = models.ManyToManyField(Answer, related_name="question")


class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    questions = models.ManyToManyField(Question, related_name ="quiz")
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quizzes", null=True, blank=True)

    def __str__(self):
        return f"{self.id}"

    def serializer(self):
        questions = self.questions.all()
        answers = []
        for question in questions:
            answerModel = question.answers.all()
            for answer in answerModel:
                answers.append(answer)
        return {
            "id":self.id,
            "name":self.name,
            "questions":serialize("json",self.questions.all()),
            "answers":serialize("json", answers)
        }
    