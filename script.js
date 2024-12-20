let questions = null
let appName = "Vanilla JS Quiz"
let quizCategory = null
const questionIndex = 0
let running = false
let progressbarWidth = 0
let timebarWidth = 100
let progressbarOffset = 0
let totalQuestions = 0
let currentAnswer = ""
let correctAnswers = 0
let jsonData = null
let interval = null

document.title = appName
document.querySelector("#appname").innerHTML = appName
const container = document.querySelector(".container")
const titleH1 = document.querySelector("#title")
const categoryH2 = document.querySelector("#category")
const skeletonDiv = document.querySelector(".skeleton")
const questionsDiv = document.querySelector("#questions")
const questionDiv = document.querySelector("#question")
const answer1Div = document.querySelector("#answer1")
const answer2Div = document.querySelector("#answer2")
const answer3Div = document.querySelector("#answer3")
const answer4Div = document.querySelector("#answer4")
const progressDiv = document.querySelector("#progress")
const progressbarDiv = document.querySelector("#progressbar")
const timebarDiv = document.querySelector("#timebar")
const statusDiv = document.querySelector("#status")
const resultsDiv = document.querySelector("#results")
const textDiv = document.querySelector(".text")
const percentageDiv = document.querySelector(".percentage")
const startButton = document.querySelector("#start")
const restartButton = document.querySelector("#restart")

async function readJson() {
    await fetch("./quiz.json")
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        jsonData = json        
        const obj = Object.keys(jsonData)
        quizCategory = obj[0]
        questions = json[quizCategory]
        totalQuestions = questions.length
    })
    .catch((error) => {
        console.log(error)
    })
}

const getQuestion = ((index) => {
    progressbarOffset++
    progressbarWidth = ((progressbarOffset / totalQuestions) * 100).toFixed(0)    
    printQuestion(questions[index])
    currentAnswer = questions[index].correct
    questions = questions.filter(q => q.id !== questions[index].id)
    statusDiv.innerHTML = `Pergunta ${progressbarOffset} de ${totalQuestions}`    
})

const checkAnswer = (answer) => {            
    if(running) {        
        running = false
        progressbarDiv.style.width = progressbarWidth + "%"
        progressbarDiv.innerHTML = progressbarWidth + "%"
        if(answer === currentAnswer) {
            correctAnswers++
        }
        if(questions.length !== 0) {
            timebarWidth = 100
            timebarDiv.style.width = "100%"
            clearInterval(interval)
            startTimer()
            getQuestion(questionIndex)
            running = true
        }
        else {
            running = false
            timebarDiv.style.display = "none"
            clearInterval(interval)
            timebarWidth = 100
            setTimeout(() => {
                progressDiv.style.display = "none"
                questionsDiv.style.display = "none"
                textDiv.innerHTML = `Você acertou ${correctAnswers} de ${totalQuestions} perguntas`
                const statistics = ((correctAnswers / totalQuestions) * 100).toFixed(0)
                if(statistics < 50) {
                    percentageDiv.style.backgroundColor = "#ff4747"
                }
                else {
                    percentageDiv.style.backgroundColor = "#90ee90"
                }
                percentageDiv.innerHTML = `${statistics}% de acertos`
                resultsDiv.style.display = "flex"
            }, 1000)            
        }
    }    
}

const printQuestion = (q) => {
    questionDiv.innerHTML = q.question
    answer1Div.innerHTML = q.answer1
    answer2Div.innerHTML = q.answer2
    answer3Div.innerHTML = q.answer3
    answer4Div.innerHTML = q.answer4    
}

answer1Div.addEventListener("click", () => {
    checkAnswer(answer1Div.innerHTML)    
})
answer2Div.addEventListener("click", () => {
    checkAnswer(answer2Div.innerHTML)    
})
answer3Div.addEventListener("click", () => {
    checkAnswer(answer3Div.innerHTML)    
})
answer4Div.addEventListener("click", () => {
    checkAnswer(answer4Div.innerHTML)    
})

function startTimer() {
    interval = setInterval(() => {
        if(timebarWidth > 0) {
            timebarWidth -= 0.5
            timebarDiv.style.width = timebarWidth + "%"
        }
        else {
            clearInterval(interval)
            checkAnswer("")
        }
    }, 100)
}

restartButton.addEventListener("click", () => {
    progressbarDiv.style.width = 0
    timebarDiv.style.width = 100
    progressbarDiv.innerHTML = ""
    resultsDiv.style.display = "none"
    progressDiv.style.display = "block"
    questionsDiv.style.display = "block"
    timebarDiv.style.display = "block"   
    progressbarWidth = 0
    progressbarOffset = 0
    currentAnswer = ""
    correctAnswers = 0
    questions = jsonData[quizCategory]
    totalQuestions = questions.length
    running = true
    timebarWidth = 100
    getQuestion(questionIndex)
    startTimer()
})

startButton.addEventListener("click", () => {
    if(questions.length > 0) {
        skeletonDiv.style.display = "none"
        container.style.display = "block"
        timebarDiv.style.display = "block"
        titleH1.innerHTML = `${appName}`
        categoryH2.innerHTML = `${quizCategory}`
        running = true
        getQuestion(questionIndex)
        startTimer()
    }    
})