const dropArea = document.querySelector('.img-drop-area')
const canvas = document.querySelector('.canvas')
const resultsContainer = document.querySelector('.results')

const objectDetector = ml5.objectDetector('cocossd', {}, modelLoaded)

let image
let scale
let ctx = canvas.getContext('2d')

dropArea.addEventListener('dragover', (e) => {
	e.stopPropagation()
	e.preventDefault()
	e.dataTransfer.dropEffect = 'copy'
})

dropArea.addEventListener('drop', (e) => {
	e.stopPropagation()
	e.preventDefault()

	const file = e.dataTransfer.files[0]

	const reader = new FileReader()
	reader.readAsDataURL(file)

	reader.addEventListener('load', (e) => {
		dropArea.querySelector('.img-drop-area__message').style.visibility = 'hidden'
		image = document.createElement('img')
		image.src = e.target.result
		

		image.addEventListener('load', function () {
			drawImage()
			objectDetector.detect(image, gotResults)
			
		})


	})
})


function modelLoaded() {
	console.log('detector loaded')
	dropArea.style.display = 'flex'
	showResults('<p class="msg">Please drop the image to the square for object recognition</p>', resultsContainer)
}


function gotResults(error, results) {
	if (error) {
		console.error(error)
	} else {
		results.forEach(object => {
			const x = object.x * scale + (object.width * scale + (canvas.width - image.width * scale)) / 2
			const y = object.y * scale + (object.height * scale + (canvas.height - image.height * scale)) / 2
			drawAnnotation(x, y, object.label)
		})
	}
}


const showResults = (markup, container) => {
	container.innerHTML = ''
	container.insertAdjacentHTML('afterbegin', markup)
}


function drawImage() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	let x, y, width, height
	if(image.width > image.height) {
		width = canvas.width
		height = width * image.height / image.width
	} else {
		height = canvas.height
		width = height * image.width / image.height
	}

	scale = width / image.width
	console.log(scale)

	x = canvas.width / 2 - width / 2
	y = canvas.height / 2 - height / 2 

	ctx.drawImage(image, x, y, width, height)
}


function drawAnnotation(x, y, name) {
	ctx.beginPath()
	ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
	ctx.fillStyle = '#FF5531'

	ctx.font = '15px Roboto'
	ctx.fillText(name.toUpperCase(), x+10, y+5)

	ctx.fill()
}