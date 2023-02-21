let score = 0;
let currentNumber = 1;
let questionsAnswered = [];
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('#questions').style.display = 'none';
    document.querySelector('#nextQuestion').style.display = 'none';
    document.querySelector('#finishQuiz').style.display = 'none';

    const startButton = document.querySelector('#startQuiz');
    startButton.onclick = () => {
        displayQuestions();
        return;
    }
    if (document.querySelector('#finishQuiz')) {
        document.querySelector('#finishQuiz').addEventListener('click', function() {
            triggerEnd();
            updatePoints();
        })
    }
})


async function fetchQuiz() {
    const API = `/quizAPI/${document.querySelector('#ALLquizname').innerHTML}`;
    const response = await fetch(API);
    const data = await response.json()

    const questions = JSON.parse(data['questions'])
    const answers = JSON.parse(data["answers"]);
    const results = [questions, answers]
    return results;
    
}
async function displayQuestions() {
    const result = await fetchQuiz();
    let questionsToGo = result[0]
    globalThis.initialLength = questionsToGo.length;
    document.querySelector('#totalNumber').innerHTML = initialLength;
    const answers = result[1];
    let questionAnswers = [];
    let question = questionsToGo[0];
    question["fields"]["answers"].forEach(id => {
        answers.forEach(answer=> {
            if (answer["pk"] === id) {
                questionAnswers.push(answer);
            }
        })
    })
    questionsToGo.shift();

    handleAnswer(question, questionAnswers, function() {
        if (questionsToGo.length !== 0)
            document.querySelector('#nextQuestion').style.display = 'block';
        else 
            finish();
    });
        
    displayQuestion(question, questionAnswers);
    if (questionsToGo.length !== 0) {
        searchQuestions(questionsToGo, initialLength, answers);
        return;
    }
    else {
        finish();
    }
}
function clearQuestion() {
    const questions = document.querySelector('#questions');
    questions.innerHTMLL ='';
    const answers = document.querySelector('#answers');
    answers.innerHTML = '';

}
function displayQuestion(question, answers) {
    document.querySelector('#nextQuestion').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('#questions').style.display = 'flex';
    document.querySelector('#scoreCount').innerHTML = score;
    document.querySelector('#currentNumber').innerHTML = currentNumber;
    currentNumber += 1;
    const element = document.querySelector('#quizQuestion');
    element.querySelector('#query').innerHTML = question["fields"]['inquiry'];
    answers.forEach(answer => {
        const div = document.createElement('div');
        div.setAttribute('id', 'answer');
        div.innerHTML = `<label id="answerInquiry">${answer["fields"]["subject"]}`
        document.querySelector('#answers').append(div);
    })
}

function searchQuestions(questionsToGo, initialLength, answers) {
    if (questionsToGo.length !== initialLength ) {
        document.querySelector('#nextQuestion').addEventListener('click', () => {
                clearQuestion();
                let question = questionsToGo[0];
                let questionAnswers = [];
                question["fields"]["answers"].forEach(id => {
                    answers.forEach(answer=> {
                        if (answer["pk"] === id) {
                            questionAnswers.push(answer);
                        }
                    })
                })
                questionsToGo.shift();
                displayQuestion(question, questionAnswers);
                handleAnswer(question, questionAnswers, function() {
                    if (questionsToGo.length !== 0)
                        document.querySelector('#nextQuestion').style.display = 'block';
                    else 
                        finish();
                });
                
        }) 
    }
}

function handleAnswer(question, questionAnswers, callback) {
    document.querySelector('#answers').addEventListener('click', function lala() {
        let answer = event.target;
        if (answer !== document.querySelector('#answers')) {
            document.querySelector('#answers').removeEventListener('click', lala);
            if (answer.id !== 'answer')
                answer = answer.parentElement;
            assessAnswer(question, questionAnswers, answer);
            callback();
        }
    })
}
function assessAnswer(question, questionAnswers, answer) {
    let question1 = {
        question:question,
        correctAnswer:'',
        actualAnswer:''
    }
    let correctAnswer = ''
    questionAnswers.forEach(questionAnswer => {
        if (questionAnswer['fields']['result'] === true) {
            correctAnswer = questionAnswer;
        }
    })
    question1.correctAnswer = correctAnswer;
    if (correctAnswer !== '') 
        if (answer.querySelector('#answerInquiry').innerHTML === correctAnswer['fields']['subject']) {
            // HANDLING CORRECT ANSWER
            answer.setAttribute('id', 'correctAnswer');
            document.querySelectorAll('#answer').forEach(questionAnswer => {
                questionAnswer.setAttribute('id', 'normalAnswer');
            })
            score += 10;
            document.querySelector('#scoreCount').innerHTML = score;
        }
    else {
        // HANDLING WRONG ANSWER
        answer.setAttribute('id', 'wrongAnswer');
        questionAnswers.forEach(answer1 => {
            if (answer1['fields']['subject'] === answer.querySelector('#answerInquiry').innerHTML) {
                question1.actualAnswer = answer1;
            }
        })
        document.querySelectorAll('#answer').forEach(questionAnswer => {
            if (questionAnswer.querySelector('#answerInquiry').innerHTML !== answer.querySelector('#answerInquiry')) {
                if (questionAnswer.querySelector('#answerInquiry').innerHTML === correctAnswer['fields']['subject']) {
                    questionAnswer.setAttribute('id', 'correctAnswer');
                }
                else {
                    questionAnswer.setAttribute('id', 'normalAnswer');
                }
            }
        })
    }
    questionsAnswered.push(question1);
}


function finish() {
    if (document.querySelector('#nextQuestion'))
        document.querySelector('#nextQuestion').remove();
    document.querySelector('#finishQuiz').style.display = 'block';
}
function triggerEnd() {
    document.querySelector('#finishQuiz').remove();
    document.querySelector('#container').style.display = 'none';
    document.querySelector('#endContainer').style.display = 'block';

    showSections();
}

function showSections() {
    document.querySelector('#scoreTab').style.display = 'flex';   
    document.querySelector('#endScore').setAttribute('id', 'scoreSelected');
    document.querySelector('#questionsAnsweredCorrectly').innerHTML = `${parseInt(score/10)} of ${questionsAnswered.length}`;
    document.querySelector('#actualScore').innerHTML = `+${score} points`;
    
        document.querySelector('#endAnswers').addEventListener('click', function() {
            document.querySelector('#scoreSelected').setAttribute('id', 'endScore');
            document.querySelector('#scoreTab').style.display = 'none';
            document.querySelector('#answerTab').style.display = 'flex';
            document.querySelector('#endAnswers').setAttribute('id', 'answersSelected');
            let counter = 1;
            document.querySelector('#answerTab').innerHTML = '';
            questionsAnswered.forEach(question => {
                const questionHTML = document.createElement('div');
                questionHTML.setAttribute('id', 'endQuestion');
                const div = document.createElement('div');
                div.setAttribute('id','endHeader');
                const inquiry = document.createElement('b');
                inquiry.setAttribute('id', 'endQuestionPrompt');
                inquiry.innerHTML = question['question']['fields']['inquiry'];
                const count = document.createElement('b');
                count.setAttribute('id', 'endCount');
                count.innerHTML = `${counter})`;
                div.append(count);
                counter++;
                div.append(inquiry);
                questionHTML.append(div);
                const correctAnswer = document.createElement('p');
                if (question['actualAnswer'] === "") {
                    correctAnswer.setAttribute('id', 'correctEndAnswer');
                    correctAnswer.innerHTML = `Your answer: ${question['correctAnswer']['fields']['subject']}`;
                    questionHTML.append(correctAnswer);
                }
                else {
                    const trueAnswer = document.createElement('p');
                    trueAnswer.setAttribute('id', 'wrongEndAnswer');
                    trueAnswer.innerHTML = `Your answer: ${question['actualAnswer']['fields']['subject']}`;
                    correctAnswer.innerHTML = `Correct answer: ${question['correctAnswer']['fields']['subject']}`;
                    correctAnswer.setAttribute('id', 'normalEndAnswer');
                    questionHTML.append(trueAnswer);
                    questionHTML.append(correctAnswer);
                }
                document.querySelector('#answerTab').append(questionHTML);
            })
            document.querySelector('#endScore').addEventListener('click', function() {
                document.querySelector('#questionsAnsweredCorrectly').innerHTML = `${parseInt(score/10)} of ${questionsAnswered.length}`;
                document.querySelector('#answersSelected').setAttribute('id', 'endAnswers');
                document.querySelector('#scoreTab').style.display = 'flex';
                document.querySelector('#answerTab').style.display = 'none';
                document.querySelector('#endScore').setAttribute('id', 'scoreSelected');
                return;
            })
        })

}

function updatePoints() {
    fetch(`/profile/${username}`, {
        method:'POST',
        body: JSON.stringify({
            points: score
        })
    })
    .then(response => response.json())
    .then(result => {
    })
}


