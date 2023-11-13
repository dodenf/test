import { menuButtonListener} from "./questList.js";

start();

const red = '#d32727';
const green = '#2fb62f';

var testResults; // итоги 

// начальное меню
function start(){
    testResults = new Array(); // новый массив с результатами
    const d = document.querySelector(".conteiner");
    d.remove();
    document.querySelector("body").insertAdjacentHTML(
        'afterbegin',
        `<div class="conteiner">
            <button class="button startButton">Начать тест</button>
            <button class="button questList">Список вопросов</button>
            <button class="button addQuest">Добавить вопрос</button>
        </div>`
    );
    menuButtonListener();
}

// вывод после окончания теста
function end(quests){ 
    const doc = document.querySelector(".conteiner");
    doc.remove();
    document.querySelector("body").insertAdjacentHTML(
        'afterbegin',
        `<div class="conteiner"><h1>Вопросы закончились</h1></div>`
    );
    // результаты
    setTimeout(()=>{
    const conteiner = document.querySelector(".conteiner");
    conteiner.remove();
    document.querySelector("body").insertAdjacentHTML(
        'afterbegin',
        `<div class="conteiner">
            <div class="header_quest">
                <h1 style="display:inline;">Результаты теста </h1>
                <h>${testResults.reduce((partialSum, a) => partialSum + a, 0)}/${testResults.length}</h>
            </div>
            ${setQuestionRes(quests)}
        </div>`
    );
    document.querySelectorAll('.questionTitle').forEach(element => {
        console.log(element.firstChild)
        element.addEventListener('click', () => {
            element.firstChild.style = 'display: none';
        })
    });
    }, 1000);
    
}

function setQuestionRes(quest){
    return quest.map(
        (quest, index) => 
        `<button class="questionTitle" style="background: ${testResults[index]? green: red};"> 
            ${index+1}. ${quest.quest} 
            <p class="correctAnsw">Правильный ответ: ${quest.answers.find(element=> element[1] == 'correctAnswer')[0]}</p>
        </button>`
    ).join('');
}

// загрузка вопросов
export function runTest(quests, numQuestion){
    setQuestion(quests[numQuestion]);
    answerEventListener(quests, numQuestion);
}

// возврат в меню
document.querySelector('.toHome').addEventListener('click', function() { start(); });

// при нажатии на ответ
function answerEventListener(quests, numQuestion) { 
    document.querySelectorAll('.answer').forEach(element => {
        element.addEventListener('click', function() {
            colorClickAnswer();
            document.querySelectorAll('.answer').forEach(element => {element.classList.remove('button')});
            // обработка результата
            disappearance(document.querySelectorAll('.wrongAnswer')); // исчезновение неправильных ответов
            if (element.classList.contains('wrongAnswer')){ 
                testResults.push(false);
                // увеличение правильного ответа
                document.querySelector('.correctAnswer').style.position = 'absolute';
                document.querySelector('.correctAnswer').style.animation = 'increase 2s linear';

                document.querySelector('h1').insertAdjacentHTML(
                    'afterend', `<h style="color: ${red};">✖</h>`
                );
            }
            if (element.classList.contains('correctAnswer')){ 
                testResults.push(true);
                setCommentToCorrectAnsw(quests[numQuestion]); // добавление комментария
                document.querySelector('h1').insertAdjacentHTML(
                    'afterend', `<h style="color: ${green};">✔</h>`
                );
            }
            if (numQuestion < quests.length-1){
                setTimeout(() => { runTest(quests, numQuestion+1);}, 2000);
            }
            else{
                setTimeout(() => {end(quests);}, 1000);
            }
        });
    });
}

function disappearance(elements){
    elements.forEach(element => {
        element.style.animation = 'disappearance 2s linear';
    });
}

function setCommentToCorrectAnsw(question){
    document.querySelector('.correctAnswer').insertAdjacentHTML(
        'beforeend',
        `<p>${question.commentCorrectAnswer}</p>`
    )
}

function colorClickAnswer(){
    document.querySelectorAll('.wrongAnswer').forEach(item => {
        item.style.background = red;
    });
    document.querySelectorAll('.correctAnswer').forEach(item => {
        item.style.background = green;
    });
}

function setQuestion(question){
    document.querySelector(".conteiner").remove();
    document.querySelector("body").insertAdjacentHTML(
        'afterbegin',
        `<div class="conteiner">
            <div class="header_quest">
                <h1>Вопрос</h1> 
            </div>
            <div class="questWrap">
                <p class="questionTitle"> ${question.quest} </p>
                <div class="wrap-answers"> ${setAnswers(getRandOrderArray(question.answers))} </div>
            </div>
        </div>`
    );
} // размещает вопрос

function setAnswers(answers) {
    return answers.map(
        (answer) => `<button type="button" class="button answer ${answer[1]}"> ${answer[0]} </button>`
    ).join('');
} // оборачивает каждый вопрос в тег button

export function getRandOrderArray(items){
    let randOrderArr = items;
    let rnd;
    let len = items.length-1;
    for (let i = 0; i < len; i++){
        rnd = randomIntFromInterval(i, len);
        let tempItem = randOrderArr[i];
        randOrderArr[i] = randOrderArr[rnd];
        randOrderArr[rnd] = tempItem;
    }
    return randOrderArr;
} // возвращает массив с элементами в случайном порядке

function randomIntFromInterval(min, max) { // min и max включены
    return Math.floor(Math.random() * (max - min + 1) + min)
}







