const cols = document.querySelectorAll('.col') //Выбирает все элементы с классом 'col' и сохраняет их в переменной cols.

/*Добавляет слушатель событий на документ для события 'keydown'. 
Когда нажимается клавиша пробела (event.code.toLowerCase() === 'space'), 
вызывается функция setRandomColors()*/
document.addEventListener('keydown', (event) => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

/*Проверяет атрибут dataset.type кликнутого элемента и выполняет различные действия в зависимости от значения: 
Если type = 'lock', он переключает классы 'fa-lock' и 'fa-lock-open' кликнутого элемента (значок замка).
Если type = 'copy', он вызывает функцию copyToClickboard() с текстовым содержимым кликнутого элемента*/
document.addEventListener('click', (event) => {
  const type = event.target.dataset.type

  if (type === 'lock') {
    const node =
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClickboard(event.target.textContent)
  }
})

//Эта функция генерирует случайный шестнадцатеричный код цвета
function gerenerateRandomColor() {
  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}

//Эта функция копирует заданный текст в буфер обмена
function copyToClickboard(text) {
  return navigator.clipboard.writeText(text)
}

/*Эта функция устанавливает случайные цвета для элементов с классом 'col'. 
Она также обрабатывает блокировку цветов, устанавливает цвет текста в зависимости от яркости 
и обновляет цвета в URL-адресе*/
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color
    col.style.background = color

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorsHash(colors)
}

//Эта функция устанавливает цвет текста в зависимости от яркости заданного цвета
function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

//Эта функция обновляет хеш URL-адреса цветами из массива
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-')
}

//Эта функция извлекает цвета из хеша URL-адреса и возвращает их как массив строк с цветами
function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color)
  }
  return []
}

setRandomColors(true)
