## Title 
The title is FactHunt, which means to aim at the sole purpose of the website, that of "hunting facts", by both answering an creating interactive quizzes. 

## Description
The site was created in order to be used by people who want to test their knowledge in a particular field by accessing quizzes others took, or, once becoming regular 'clients', being able to help others by making quizzes themselves (anonymously).

## Features
- Answer Quiz:
    - Once entering the 'All Projects' page, the user can see multiple quizzes, which, on click, will be accessed.
    - When you access one of the quizzes, you will see a page that prompts you to 'Start Quiz'.
    - Once clicking 'Start Quiz', the questions start to appear, and you can answer the inquiry by clicking one of the answers listed.
    - If the answer clicked is right, the said answer will become green, and the others gray.
    - If the answer clicked is wrong, the said answer will become red, the correct one will be green, others will be gray.
- Create Quiz
    - Once a user has accumulated 1000 points in other quizzes (10 points / correct question - roughly 100 questions answered correctly), they will be able to create their own quizzes. 
    - By clicking the 'New Quiz' default title twice, the user will be able to change the name of the  quiz into their preferred title inside of an input, afterwards being able to select it by pressing enter. 
    - By clicking the 'Add Question' button, the user will be presented with a popup, that will show a default two answers for a question, whose prompts the user can write and select as correct by clicking the checkbox right next to the said answers. If the user wishes to create or delete answers, they can do so by clicking the 'Add Answers' button, respectively by clicking the 'X' prompts next to the answers they want to remove.
    - The only requirement is that the user has a correct answer to each question, otherwise the user will be prompted with further instruction if they fail to accomplish it.
    - Once the user feels they are ready to submit the question, they can press the 'Submit Question' button, which, if the requirement is reached, will be posted on the page as preview. 
    - After creating as many questions as the user would like, they can submit the quiz by clicking the 'Save Quiz' button, provided the title entered is not the same as any other quiz name in the database, otherwise the user will be prompted with a warning, and a link to the quiz with the said name, in case they want to check out a different view on the subject.
    - If the quiz name is unique, the user will be presented with a green message, stating that the quiz has been saved and providing a link to the said quiz's page.

## Distinctiveness and complexity 
It differs from the other projects in this course by a lot. First of all, compared to the other projects, it was actually mainly done in Javascript, with support from the serverside Django. The quiz function is completely asynchronous and constitutes a single page application by itself. The concept is extremely different as well, since CS50W has not tackled a subject such as interactive education, apart from the "Wiki" project, which was one of the first projects and was not as complex and did not offer the interactivity FactHunt offers.

Moreover, this project is also significantly complex, using a lot of Javascript code, especially for the quiz pages, that not only allow users to answer questions and see which is the correct solution, but also provides two options at the end, represented by viewing one's score, but also reviewing all the questions the quiz offered with the answers given. 

## Containment of files
First of all, there is a 'media' folder, that basically is the folder where all the profile pictures are stored.

The 'static' folder contains both Javascript and CSS files, quite a lot, done in order to simplify the code by linking them by name (Javascript - CSS- HTML). There are also two files which do not correspond with the names of any HTML files, those are the 'default.css' and 'yellow.css' files, which serve as background colors for the site. (Yellow on white / White on Yellow).

The 'templates' folder contains all the HTML files used.

The other files are basic Django files, that were default when the application was created, apart from 'context_processors.py' and 'serialisers.py', the first one of which allows the 'layout.html' file to have access to the profile of the user that is registered, in order to load the correct background colors that the user has picked out beforehand. 'Serializers.py' was applied in order to convert the 'Answers' model to JSON successfully.

## Run the project
In terms of running, the project requires django, which you can obtain by running 'pip install django' in the terminal. To run the project, all you have to type is 'python manage.py runserver'.



