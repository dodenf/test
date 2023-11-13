
export class Question{
    constructor(quest, answers, commentCorrectAnswer){
        this.quest = quest;
        this.answers = answers.map(
            (answer) => [answer, "wrongAnswer"]
        );
        this.answers[0][1] = "correctAnswer"; // первый ответ правильный
        this.commentCorrectAnswer = commentCorrectAnswer;
    }
}

