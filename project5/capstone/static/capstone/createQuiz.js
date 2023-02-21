
let counter = 3;

let QUESTIONS = [];

document.addEventListener('DOMContentLoaded', () => {
    if (QUESTIONS) {
        QUESTIONS.forEach(question => {
            const quest = document.createElement('div');
            div.setAttribute('id', 'question');
            div.style = "border:1px solid black;"
            div.innerHTML = `${question.prompt}`
            document.querySelector('#questions').append(quest);
        })
    }
    document.querySelector('#addQuestion').onclick = function() {
        attentionate()
    }
    document.querySelector('#addAnswers').onclick = () => {
        addAnswer();
    }
    document.addEventListener('click', function() {
        document.querySelectorAll('#closeAnswer').forEach(close => {
            close.onclick = function() {
                id = parseInt(close.parentElement.querySelector('#count').innerHTML); 
                deleteAnswer(id); 
            }
        })
        if (event.target === document.querySelector('#appendQuestion')) {
            if (QUESTIONS) {
                document.querySelector('#questions').innerHTML = '';
                let id=1;
                document.querySelector('#saveQuiz').disabled = false;
                QUESTIONS.forEach(question => {
                    const quest = document.createElement('div');
                    quest.setAttribute('id', 'question');
                    let answers = question.answers;
                    quest.innerHTML = `<b>${id}) ${question.prompt}</b>`;
                    answers.forEach(answer => {
                        if (answer.result === true) {
                            quest.innerHTML += `<div id="answerDisplay">${answer.prompt} <span id="check">&#10004;</span></div>`
                        }
                        else
                            quest.innerHTML += `<div id="answerDisplay">${answer.prompt}</div>`
                    })
                    document.querySelector('#questions').append(quest);
                    id++;
                })
            }
        }
        else if (event.target === document.querySelector('#saveQuiz')) 
            saveQuiz();
    })

    document.addEventListener('dblclick', () => {
        if (event.target === document.querySelector('#newQuiz'))
            changeName();
    })


    document.addEventListener('keypress', function() {
        if (event.key === "Enter" && event.target === document.querySelector('#modifyingQuizName'))
            saveName();
    })

    document.querySelector('#appendQuestion').addEventListener('click', () => {
        submitQuestion();
    })
})



function addQuestion() {
    document.querySelector('#questionArea').value ='';
    document.querySelector('#warningNone').style.display = 'none';
    document.querySelectorAll('#answer').forEach(answer => {
        answer.querySelector('#answerPrompt').value = '';
        answer.querySelector('#actualAnswer').checked = false;
    })
    const popup = document.querySelector('#addQuestionForm');
    popup.style.display = 'block';

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    }
    document.querySelector('#closeForm').onclick = function() {
        popup.style.display ='none';
    }
}

function addAnswer() {
    document.querySelector('#warningNone').style.display = 'none';
    const div = document.createElement('div');
    div.setAttribute("id", "answer");
    div.innerHTML = `<b id="count">${counter}</b> <input id="answerPrompt" type="text"> <input type="checkbox" id="actualAnswer"> correct <span id="closeAnswer">&times;</span>`;
    document.querySelector('#answerSpace').append(div);
    counter++;
}

function deleteAnswer(id) {
    document.querySelectorAll('#answer').forEach(answer => {
        const answerId = parseInt(answer.querySelector('#count').innerHTML);
        if (id < answerId)
            answer.querySelector('#count').innerHTML = parseInt(answer.querySelector('#count').innerHTML) -1;
        else if (id === answerId) 
            answer.remove();
    })
    counter--;
    if (counter === 1) {
        promptAdd();
    }
}
function promptAdd() {
    document.querySelector('#warningNone').style.display = 'block';
    document.querySelector('#warningNone').innerHTML = 'You must add at least one answer!'
}

function submitQuestion() {
    document.querySelector('#warningNone').style.display = 'none';
    let correctCount = 0;
    const prompt = document.querySelector('#questionArea').value;
    let question = {
        prompt: prompt,
        answers: []
    }
    document.querySelectorAll('#answer').forEach(answer => {
        let answerPrompt = answer.querySelector('#answerPrompt').value
        let result = false;
        if (answer.querySelector('#actualAnswer').checked === true) {
            result = true;
            correctCount++;
        }
        let actualAnswer =  {
            result:result,
            prompt:answerPrompt
        }
        question.answers.push(actualAnswer);
    })
    if (correctCount === 1) {
        QUESTIONS.push(question);
        document.querySelector('#closeForm').click();
    }
    else if (correctCount === 0) {
        document.querySelector('#warningNone').style.display = 'block';
        document.querySelector('#warningNone').innerHTML = "There must be a correct answer to the question."
    }
    else if (correctCount > 1) {
        document.querySelector('#warningNone').style.display = 'block';
        document.querySelector('#warningNone').innerHTML = 'The limit is one correct answer.'
    }
}

function changeName() {
    var value = document.querySelector('#newQuiz').innerHTML;
    document.querySelector('#newQuiz').remove();
    var input = document.createElement('input');
    input.value = value; 
    input.setAttribute('id', 'modifyingQuizName');
    document.querySelector('#spaceNewQuiz').prepend(input);
}

function saveName() {
    var value = document.querySelector('#modifyingQuizName').value;
    document.querySelector('#modifyingQuizName').remove();
    var name = document.createElement('h3');
    name.innerHTML = value;
    name.setAttribute('id', 'newQuiz');
    document.querySelector('#spaceNewQuiz').prepend(name);
}

function saveQuiz() {
    const alert = document.querySelector('#messages');
    if (document.querySelector('#newQuiz') === null) {
        alert.className = 'alert alert-danger';
        alert.innerHTML = "Press enter to select the name before saving!"
    }
    else {
        fetch('/quizzes', {
            method: 'POST',
            body: JSON.stringify({
            questions: QUESTIONS,
            name: document.querySelector('#newQuiz').innerHTML
            })
        })
        .then(response => {
            Status = response.status;
            return response.json();
        })
        .then(result => {
            let name = document.querySelector('#newQuiz').innerHTML;
            name = name.split(' ').join('%20');
            const urlLink = `quiz/${name}`;
            if (Status === 400) {
                alert.className = 'alert alert-danger';
                alert.innerHTML = `Such a quiz already exists! <a href=${urlLink}>(See quiz)</a>`
            }
            else if (Status === 404) {
                alert.className = 'alert alert-danger';
                alert.innerHTML = "You must enter a name!"
                document.querySelector('#newQuiz').innerHTML = "New Quiz";
            }
            else {
                alert.className = 'alert alert-success';
                alert.innerHTML = `<b>Quiz saved.</b> <a href=${urlLink} id="seeQuiz">See Quiz.</a>`
            }
        })
    }

}
function attentionate() {
    fetch(`profile/${username}`)
    .then(response => response.json())
    .then(results => {
        if (results.points < 1000) {
            if (document.querySelector('#alert'))
                document.querySelector('#alert').remove();
            document.querySelector('#addQuestion').disabled = true;
            const message = document.createElement('div');
            message.className = 'alert alert-danger';
            message.setAttribute('id', 'alert')
            message.innerHTML = 'You must collect 1000 points to be able to create a quiz of your own!'
            document.querySelector('#spaceNewQuiz').prepend(message);
        }
        else
            addQuestion();
    })
}
