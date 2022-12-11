// Элемент для выбора файлов.
const INPUT = document.querySelector('input[name="readable"]');
// Элемент для вывода сгенерированной таблицы.
const PREVIEW = document.querySelector('#preview');
// Регулярное выражение для проверки расширения файла.
const REGEX = new RegExp('(.*?)\.(csv)$', 'i');

// Функция, обрабатывающая файл.
function handleFile(event) {
  // Выбираем первый файл из списка файлов.
  const file = event.target.files[0];

  // Если файл выбран и его расширение допустимо,
  // то читаем его содержимое и отправляем
  // в функцию отрисовки таблицы.
  if (file && REGEX.test(file.name)) {
    // Создаем экземпляр объекта.
    const reader = new FileReader();

    // Чтение файла асинхронное, поэтому
    // создание таблицы привязываем к событию `load`,
    // которое срабатывает при успешном завершении операции чтения.
    reader.onload = (e) => renderTable(e.target.result);

    // Читаем содержимое как текстовый файл.
    reader.readAsText(file);
  } else {
    //  обработка ошибок.
    alert('Файл не выбран либо его формат не поддерживается.');
    event.target.value = '';
  }
}

// Функция отрисовки таблицы.
function renderTable(data) {
  // Предварительно создадим элементы,
  // отвечающие за каркас таблицы.
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  // Добавим класс к таблице.
  table.classList.add('table');
  let head_names = ['ФИО', 'Проект', 'Год', 'Начало отпуска', 'Конец отпуска', 'Количество дней отпуска']
  let trow = document.createElement('tr')
  for (let i = 0; i < 6; i++) {
    let tcell = document.createElement('th');
    tcell.textContent = head_names[i]
    trow.appendChild(tcell)
  };
  thead.appendChild(trow);
  // Разбиваем входящие данные построчно.
  // Разделитель - перенос строки.
  // Перебираем полученный массив строк.
  data.split(/\r\n|\r|\n/)
    .forEach(function (row) {
      // Создадим элемент строки для таблицы.
      let trow = document.createElement('tr');

      // Разбиваем каждую строку на ячейку.
      // Разделитель - точка с запятой.
      // Перебираем полученный массив будущих ячеек.
      row.split(/;/).forEach(function (cell) {
        // Создадим элемент ячейки для таблицы.
        let tcell = document.createElement('td');
        // Заполним содержимое ячейки.
        tcell.textContent = cell;
        // Добавляем ячейку к родительской строке.
        trow.appendChild(tcell);
      });

      // Добавляем строку к родительскому элементу.
      tbody.appendChild(trow);
    });

  // Добавляем тело таблицы к родительскому элементу.
  table.appendChild(thead);
  table.appendChild(tbody);
  table.classList.add("table-bordered", "container", "info-table")
  // Очищаем элемент для вывода таблицы.
  PREVIEW.innerHTML = '';
  // Добавляем саму таблицу к родительскому элементу.
  PREVIEW.appendChild(table);
  sort()
  getProjects()
  createFilter()
}


// Регистрируем функцию обработчика события `change`,
// срабатывающего при изменении элемента выбора файла.
INPUT.addEventListener('change', handleFile);
// Поиск по странице
function tableSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-text");
  filter = input.value.toUpperCase();
  table = document.getElementsByClassName("info-table");
  tr = document.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    let cell = tr[i]
    if (cell) {
      txtValue = cell.textContent || cell.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// создание массива сотрудников

function sort() {
  let tr = document.getElementsByTagName("tr");

  let workers = [];
  let nameWorkers = [];

  function Worker(name, project, year, startVac, endVac, lengthOfVacation) {
    this.name = name,
      this.project = project,
      this.year = year,
      this.vacations = [{ startVac, endVac, lengthOfVacation }]
  }
  for (let i = 1; i < tr.length - 1; i++) {

    fioCell = tr[i].getElementsByTagName("td")[0];
    fio = fioCell.textContent;
    projectCell = tr[i].getElementsByTagName("td")[1]
    project = projectCell.textContent;
    yearCell = tr[i].getElementsByTagName("td")[2];
    year = yearCell.textContent;
    startVacationCell = tr[i].getElementsByTagName("td")[3];
    startVac = startVacationCell.textContent;
    endVacationCell = tr[i].getElementsByTagName("td")[4];
    endVac = endVacationCell.textContent;
    lengthOfVacationCell = tr[i].getElementsByTagName("td")[5];
    lengthOfVacation = lengthOfVacationCell.textContent

    if (nameWorkers.includes(fio)) {

      for (let i = 0; i < workers.length; i++) {
        if (workers[i].name == fio) {
          workers[i].vacations.push({ startVac, endVac, lengthOfVacation })
        }
      }
    }
    else {
      let newWorker = new Worker(fio, project, year, startVac, endVac, lengthOfVacation);
      workers.push(newWorker);
      nameWorkers.push(fio)
    }
  }
  return workers
}
function getProjects() {
  let workers = sort()

  let projects = []
  for (let i = 0; i < workers.length; i++) {
    if (projects.includes(workers[i].project)) {
      continue
    }
    else {
      projects.push(workers[i].project)
    }
  }

  return projects
}

function createFilter() {
  let values = []
  let PREVIEW = document.querySelector('#filter');
  let child = document.createElement("div")
  child.classList.add('filter')
  let head = document.createElement('h6')
  head.textContent = 'Выбрать проект:'
  child.appendChild(head)
  let projects = getProjects()
  for (let i = 0; i < projects.length; i++) {
    let cont = document.createElement('div')
    cont.classList.add('form-check')
    let inp = document.createElement('input')
    inp.classList.add("form-check-input")
    inp.setAttribute('type', "checkbox")
    inp.setAttribute('id', "flexCheckDefault")
    inp.setAttribute('id', `checkbox-${i + 1}`)
    inp.setAttribute('value', `${projects[i]}`)
    inp.addEventListener("change", function () {
      if (this.checked) {
        values.push(this.value)
      } else {
        ind = values.indexOf(this.value)
        values.splice(ind, 1)
      }
      filtering(values)
    }

    )

    let lab = document.createElement('label')
    lab.classList.add("form-check-label")
    lab.setAttribute('for', "flexCheckDefault")
    lab.textContent = `${projects[i]}`

    cont.appendChild(inp)
    cont.appendChild(lab)
    child.appendChild(cont)
  }

  PREVIEW.innerHTML = '';
  PREVIEW.appendChild(child);

}
function createFilter2() {
  let PREVIEW = document.querySelector('#filter-page2');
  let values = []
  let child = document.createElement("div")
  child.classList.add('filter')
  let head = document.createElement('h6')
  head.textContent = 'Выбрать проект:'
  child.appendChild(head)
  let projects = getProjects()
  for (let i = 0; i < projects.length; i++) {
    let cont = document.createElement('div')
    cont.classList.add('form-check')
    let inp = document.createElement('input')
    inp.classList.add("form-check-input")
    inp.setAttribute('type', "checkbox")
    inp.setAttribute('id', "flexCheckDefault")
    inp.setAttribute('id', `checkbox-${i + 1}`)
    inp.setAttribute('value', `${projects[i]}`)
    inp.addEventListener("change", function () {
      if (this.checked) {
        console.log(this.value)
        values.push(this.value)
      } else {
        ind = values.indexOf(this.value)
        values.splice(ind, 1)
      }
      filteringPage2(values)
      filteringPage2Grid(values)
    }
    )
    let lab = document.createElement('label')
    lab.classList.add("form-check-label")
    lab.setAttribute('for', "flexCheckDefault")
    lab.textContent = `${projects[i]}`
    cont.appendChild(inp)
    cont.appendChild(lab)
    child.appendChild(cont)
  }
  PREVIEW.innerHTML = '';
  PREVIEW.appendChild(child);

}
function createFilter3() {
  let PREVIEW = document.querySelector('#filter-page3');
  let values = []
  let child = document.createElement("div")
  child.classList.add('filter')
  let head = document.createElement('h6')
  head.textContent = 'Выбрать проект:'
  child.appendChild(head)
  let projects = getProjects()
  for (let i = 0; i < projects.length; i++) {
    let cont = document.createElement('div')
    cont.classList.add('form-check')
    let inp = document.createElement('input')
    inp.classList.add("form-check-input")
    inp.setAttribute('type', "checkbox")
    inp.setAttribute('id', "flexCheckDefault")
    inp.setAttribute('id', `checkbox-${i + 1}`)
    inp.setAttribute('value', `${projects[i]}`)
    inp.addEventListener("change", function () {
      if (this.checked) {
        console.log(this.value)
        values.push(this.value)
      } else {
        ind = values.indexOf(this.value)
        values.splice(ind, 1)
      }
      filteringPage3(values)
    }
    )
    let lab = document.createElement('label')
    lab.classList.add("form-check-label")
    lab.setAttribute('for', "flexCheckDefault")
    lab.textContent = `${projects[i]}`
    cont.appendChild(inp)
    cont.appendChild(lab)
    child.appendChild(cont)
  }
  PREVIEW.innerHTML = '';
  PREVIEW.appendChild(child);

}
function filtering(mas) {
  if (mas.length > 0) {
    let tr = document.getElementsByTagName("tr");
    for (let j = 0; j < tr.length - 1; j++) {
      let cell = tr[j].getElementsByTagName("td")[1]
      if (cell) {
        txtValue = cell.textContent
        if (mas.includes(txtValue)) {
          tr[j].style.display = "";
        }
        else {
          tr[j].style.display = "none";
        }
      }
    }
  }
  else {
    let tr = document.getElementsByTagName("tr");
    for (let j = 0; j < tr.length - 1; j++) {
      tr[j].style.display = "";
    }
  }


}
function filteringPage2(mas) {

  if (mas.length > 0) {

    let tr = document.getElementsByClassName('chart-container');
    for (let j = 0; j < tr.length; j++) {
      let cell = document.getElementsByClassName("chart-p-project")
      if (cell[j]) {
        txtValue = cell[j].textContent
        if (mas.includes(txtValue)) {
          tr[j].style.display = "";
        }
        else {
          tr[j].style.display = "none";
        }
      }
    }
  }
  else {
    let tr = document.getElementsByClassName('chart-container');
    for (let j = 0; j < tr.length; j++) {
      tr[j].style.display = "";
    }
  }


}
function filteringPage2Grid(mas) {

  if (mas.length > 0) {
    for (let i = 0; i < workers.length; i++) {
      let blockNum = document.getElementsByClassName('num-of-worker')
      let blockName = document.getElementsByClassName('name-of-worker')
      let blockProject = document.getElementsByClassName('project-of-worker')
      let blockYear = document.getElementsByClassName('grid-item-year')
      if (mas.includes(blockProject[i].textContent)) {
        blockNum[i].style.display = "";
        blockName[i].style.display = "";
        blockProject[i].style.display = "";
        blockYear[i].style.display = "";
      }
      else {
        blockNum[i].style.display = "none";
        blockName[i].style.display = "none";
        blockProject[i].style.display = "none";
        blockYear[i].style.display = "none";
      }
    }
  }
  else {
    for (let i = 0; i < workers.length; i++) {
      let blockNum = document.getElementsByClassName('num-of-worker')
      let blockName = document.getElementsByClassName('name-of-worker')
      let blockProject = document.getElementsByClassName('project-of-worker')
      let blockYear = document.getElementsByClassName('grid-item-year')
      blockNum[i].style.display = "";
      blockName[i].style.display = "";
      blockProject[i].style.display = "";
      blockYear[i].style.display = "";
    }
  }

}
function filteringPage3(mas) {

  if (mas.length > 0) {

    let tr = document.getElementsByClassName("accordion-item");
    for (let j = 0; j < tr.length; j++) {
      let cell = document.getElementsByClassName("project-name")
      if (cell[j]) {
        txtValue = cell[j].textContent
        if (mas.includes(txtValue)) {
          tr[j].style.display = "";
        }
        else {
          tr[j].style.display = "none";
        }
      }
    }
  }
  else {
    let tr = document.getElementsByClassName("accordion-item");
    for (let j = 0; j < tr.length; j++) {
      tr[j].style.display = "";
    }
  }
}

// вкладки на странице
class ItcTabs {
  constructor(target, config) {
    const defaultConfig = {};
    this._config = Object.assign(defaultConfig, config);
    this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
    this._elButtons = this._elTabs.querySelectorAll('.tabs__btn');
    this._elPanes = this._elTabs.querySelectorAll('.tabs__pane');
    this._eventShow = new Event('tab.itc.change');
    this._init();
    this._events();
  }
  _init() {
    this._elTabs.setAttribute('role', 'tablist');
    this._elButtons.forEach((el, index) => {
      el.dataset.index = index;
      el.setAttribute('role', 'tab');
      this._elPanes[index].setAttribute('role', 'tabpanel');
    });
  }
  show(elLinkTarget) {
    const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
    const elLinkActive = this._elTabs.querySelector('.tabs__btn_active');
    const elPaneShow = this._elTabs.querySelector('.tabs__pane_show');
    if (elLinkTarget === elLinkActive) {
      return;
    }
    elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
    elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
    elLinkTarget.classList.add('tabs__btn_active');
    elPaneTarget.classList.add('tabs__pane_show');
    this._elTabs.dispatchEvent(this._eventShow);
    elLinkTarget.focus();
  }
  showByIndex(index) {
    const elLinkTarget = this._elButtons[index];
    elLinkTarget ? this.show(elLinkTarget) : null;
  };
  _events() {
    this._elTabs.addEventListener('click', (e) => {
      const target = e.target.closest('.tabs__btn');
      if (target) {
        e.preventDefault();
        this.show(target);
      }
    });
  }
}
// инициализация .tabs как табов
new ItcTabs('.tabs');

// личная карточка сотрудника
function createCards() {

  const PREVIEW = document.querySelector('#cards');
  let accord = document.createElement('div')
  accord.classList.add("accordion", "accordion-flush")
  workers = sort()
  for (let i = 0; i < workers.length; i++) {
    let personCard = document.createElement('div')
    personCard.classList.add("accordion-item")

    let personCardTitle = document.createElement("h2")

    personCardTitle.classList.add("accordion-header")
    personCardTitle.setAttribute('id', `titleWorker-${i}`)

    personCardTitle.addEventListener('click', function () {
      id = this.id[this.id.length - 1]
      let btnOfItem = document.getElementById(`btnWorker-${id}`)
      bool = btnOfItem.getAttribute('aria-expanded')
      let item = document.getElementById(`percardWorker-${id}`)
      if (bool === 'true') {
        item.classList.remove("show")
        btnOfItem.setAttribute('aria-expanded', false)
        btnOfItem.classList.add('collapsed')
      }
      else {
        item.classList.add("show")
        btnOfItem.classList.remove('collapsed')
        btnOfItem.setAttribute('aria-expanded', true)
      }
    })

    let accordBtn = document.createElement("button")
    accordBtn.setAttribute('aria-expanded', false)
    accordBtn.setAttribute('id', `btnWorker-${i}`)
    accordBtn.classList.add("accordion-button", "collapsed")

    let projName = document.createElement('div')
    projName.classList.add('project-name')
    projName.textContent = `${workers[i].project}`

    let personName = document.createElement('div')
    personName.classList.add('person-name')
    personName.textContent = `${workers[i].name}`

    let personCardBody = document.createElement('div')
    personCardBody.classList.add("accordion-collapse", "collapse")
    personCardBody.setAttribute('id', `percardWorker-${i}`)

    accordBtn.appendChild(personName)
    accordBtn.appendChild(projName)

    personCardTitle.appendChild(accordBtn)
    let personCardBodyContent = document.createElement('div')
    personCardBodyContent.classList.add("accordion-body")

    let cardHolder = document.createElement('div')

    for (let j = 0; j < workers[i].vacations.length; j++) {
      let vacCard = document.createElement('div');
      vacCard.classList.add('card')

      let vacCardBody = document.createElement('div');
      vacCardBody.classList.add('card-body')

      let vacCardTitle = document.createElement('h5');
      vacCardTitle.classList.add("card-title")
      vacCardTitle.textContent = `Отпуск ${j + 1}`

      let vacCardText1 = document.createElement('p');
      vacCardText1.classList.add("card-text")

      let vacCardText2 = document.createElement('p');
      vacCardText2.classList.add("card-text")

      let vacCardText3 = document.createElement('p');
      vacCardText3.classList.add("card-text")

      vacCardText1.textContent = `Начало отпуска: ${workers[i].vacations[j].startVac}`
      vacCardText2.textContent = `Конец отпуска: ${workers[i].vacations[j].endVac}`
      vacCardText3.textContent = `Количество дней отпуска: ${workers[i].vacations[j].lengthOfVacation}`

      vacCardBody.appendChild(vacCardTitle);
      vacCardBody.appendChild(vacCardText1);
      vacCardBody.appendChild(vacCardText2);
      vacCardBody.appendChild(vacCardText3);

      vacCard.appendChild(vacCardBody)
      cardHolder.appendChild(vacCard)

    }
    personCardBodyContent.appendChild(cardHolder)
    personCardBody.appendChild(personCardBodyContent);
    personCard.appendChild(personCardTitle)
    personCard.appendChild(personCardBody)
    accord.appendChild(personCard)


  }
  PREVIEW.innerHTML = '';

  PREVIEW.appendChild(accord);
  createFilter3()
}
// графическое отображение продолжительности отпуска
function vacChart() {
  const PREVIEW = document.querySelector('#dayCnt');
  workers = sort()
  let mainChart = document.createElement('div')
  mainChart.classList.add('scrolling-wrapper')

  let scale = document.createElement('div')
  scale.classList.add('scale')

  let scaleNum = document.createElement('div')
  scaleNum.classList.add('scale-num')

  let scaleP1 = document.createElement('p')
  scaleP1.textContent = '30'

  let scaleP2 = document.createElement('p')
  scaleP2.textContent = '15'

  let scaleP3 = document.createElement('p')
  scaleP3.textContent = '0'

  scaleNum.appendChild(scaleP1)
  scaleNum.appendChild(scaleP2)
  scaleNum.appendChild(scaleP3)

  let scaleLine = document.createElement('div')
  scaleLine.classList.add('scale-line')

  scale.appendChild(scaleNum)
  scale.appendChild(scaleLine)
  mainChart.appendChild(scale)
  
  let colors = ['rgb(236, 190, 39)', 'rgb(79, 206, 110)', 'rgb(82, 94, 199)', 'rgba(47, 24, 66, 1)']
  
  for (let i = 0; i < workers.length; i++) {
    let container = document.createElement('div')
    container.classList.add('chart-container')
    let column = document.createElement('div')
    column.classList.add('column', 'flex')

    let p = document.createElement('div')
    p.classList.add('chart-p')
    p.textContent = workers[i].name

    let p1 = document.createElement('div')
    p1.classList.add('chart-p', 'chart-p-project')
    p1.textContent = workers[i].project

    for (let j = 0; j < workers[i].vacations.length; j++) {
      let styleItem = document.createElement('div')
      let daysOfVac = +workers[i].vacations[j].lengthOfVacation
      styleItem.style.cssText = `
          background-color: ${colors[j]};
          width: 100%;
          height: ${daysOfVac * 10}px;
          display: flex;
        `;
      column.appendChild(styleItem)
    }
    container.appendChild(column)
    container.appendChild(p)
    container.appendChild(p1)
    mainChart.appendChild(container)
  }

  PREVIEW.innerHTML = '';
  PREVIEW.appendChild(mainChart);
}

function vacTable() {
  const PREVIEW = document.querySelector('#dayTable');
  workers = sort()
  let mainChart = document.createElement('div')
  mainChart.classList.add('vac-table')
  PREVIEW.innerHTML = '';
  PREVIEW.appendChild(mainChart);
  let rows = workers.length + 1;
  let months = ["январь", "февраль", "март", "апрель",
    "май", "июнь", "июль", "август", "сентябрь",
    "октябрь", "ноябрь", "декабрь"]
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < 4; j++) {
      let div = document.createElement('div')
      div.classList.add('grid-item')
      div.classList.add('grid-item-border')
      if (j === 3 && i > 0) {
        div.classList.remove('grid-item')
        div.classList.remove('grid-item-border')
        div.classList.add('grid-item-year')
        for (let d = 0; d < 365; d++) {
          let day = document.createElement('div')
          day.classList.add('grid-item-day')
          div.appendChild(day)
        }

      }
      if (i === 0 && j > 2) {
        div.classList.add("grid-item-month")
        div.classList.remove('grid-item', 'grid-item-border')
        for (let m = 0; m < months.length; m++) {
          let month = document.createElement('div')
          month.textContent = `${months[m]}`
          div.appendChild(month)
        }
      }
      if (j === 0) {
        if (i === 0) {
          div.textContent = '№'
        }
        else {
          div.classList.add('num-of-worker')
          div.textContent = `${i}`
        }
      }
      if (j === 1) {
        if (i === 0) {
          div.textContent = 'ФИО'
        }
        else {
          div.classList.add('name-of-worker')
          div.textContent = `${workers[i - 1].name}`
        }
      }
      if (j === 2) {
        if (i === 0) {
          div.textContent = 'Проект'
        }
        else {
          div.classList.add('project-of-worker')
          div.textContent = `${workers[i - 1].project}`
        }
      }
      mainChart.appendChild(div)
    }
  }
  // ЗАПОЛНЕНИЕ ОТПУСКОВ
  let k = document.getElementsByClassName('num-of-worker')
  let year = document.getElementsByClassName('grid-item-year')
  // цикл по строкам грида и сотрудникам
  for (let i = 0; i < workers.length; i++) {
    let index = +(k[i].textContent)
    let n = year[index - 1].getElementsByClassName('grid-item-day')
    // цикл по отпускам каждого сотрудника
    for (let v = 0; v < workers[index - 1].vacations.length; v++) {
      let start = workers[index - 1].vacations[v].startVac;
      let days = workers[index - 1].vacations[v].lengthOfVacation;
      let position = (+start.slice(3, 5) - 1) * 30 + (+start.slice(0, 2))
      for (let d = 0; d < days; d++) {
        pos = n[position + d]
        pos.classList.add("green-cell")
      }
    }
  }
}
function mixFunc() {
  vacChart()
  vacTable()
  createFilter2()
}
