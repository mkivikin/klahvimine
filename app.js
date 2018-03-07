/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.score = 0
  this.multiplier = 0
  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
	console.log("init")
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
		console.log("onreadystatechange")
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]
    this.word = new Word(wordFromArray, this.canvas, this.ctx)
	console.log("genereerin sõna")
	this.multiplier = generatedWordLength
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)
	console.log("vaatab mis tähte kirjutati")
    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
		this.score += 1
      if (this.word.left.length === 0) {
        this.guessedWords += 1
        this.generateWord()
		this.score = this.score + (this.multiplier*this.guessedWords)
		console.log("Sõna arvatud")
		console.log(this.score)
      }

      this.word.Draw()
    } else {
		if (this.score > 0) {
		this.score = this.score-(this.guessedWords)
		console.log(this.score)
		}
	}
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
  console.log("Teeb objekti")
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
	console.log("Kirjutab sõna")
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
	console.log("eemaldab esimese tähe")
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []
	console.log("hui tean")
  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
	//console.log(tempArray[i])
  }

  return tempArray
}

window.onload = function () {
	console.log("aken laeb")
  const typer = new TYPER()
  window.typer = typer
}
