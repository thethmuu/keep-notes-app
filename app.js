// global selectors
const noteContainer = document.querySelector('.note-container');
const categoryContainer = document.querySelector('.categories-container');

const modal = document.querySelector('#modal');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const toggleBtn = document.querySelector('.toggle-btn');
const search = document.querySelector('#search');
const categoriesInput = document.querySelector('#categories');
// notes
let notes = [];
let filteredNotes = [];
const categories = [
  {
    id: 1,
    name: 'coding',
  },
  {
    id: 2,
    name: 'personal',
  },
  {
    id: 3,
    name: 'idea',
  },
];

function showAllCategories() {
  categories.forEach((category) => {
    addCategoryToList(category);
    addCategoryToSidebar(category);
  });
}

function addCategoryToList(category) {
  const optionEl = document.createElement('option');
  optionEl.setAttribute('value', category.id);
  optionEl.textContent = category.name;
  categoriesInput.appendChild(optionEl);
}

function addCategoryToSidebar(category) {
  const liEl = document.createElement('li');
  liEl.classList.add('category-item');
  liEl.innerHTML = `<span class="hidden-id" hidden>${category.id}</span>
                    <span>${category.name}</span>`;
  categoryContainer.appendChild(liEl);
}

search.addEventListener('keyup', filterNote);

function filterNote() {
  const searchTerm = search.value.toLowerCase();

  filteredNotes = notes.filter((note) => {
    return [note.title, note.body].join('').toLowerCase().includes(searchTerm);
  });

  noteContainer.innerHTML = '';
  filteredNotes.forEach((note, index) => {
    addNotetoList(note, index);
  });
}

function filterNoteByCategory(id) {
  let categorizedNote = notes.filter((note) => note.category === id);

  noteContainer.innerHTML = '';
  categorizedNote.forEach((note, index) => {
    addNotetoList(note, index);
  });
}

// default theme
let theme = 'light';
function toggleTheme() {
  theme === 'light' ? (theme = 'dark') : (theme = 'light');
  loadTheme();
}

function loadTheme() {
  const root = document.querySelector(':root');
  root.setAttribute('color-scheme', theme);
  toggleBtn.innerHTML =
    theme === 'light'
      ? `<i class="fa-solid fa-lightbulb"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
}

toggleBtn.addEventListener('click', () => {
  const sound = document.querySelector('.toggle-sound');
  sound.currentTime = 0;
  sound.play();
  toggleTheme();
  localStorage.setItem('keep.theme', theme);
});

// Class: for creating a  new  note
class Note {
  constructor(title, body, category) {
    this.title = title;
    this.body = body;
    this.category = category;
    this.id = Math.floor(Math.random() * 2000);
  }
}

// Saving to localStorage
// Function: Retreive notes from local storage
function getNotes() {
  if (localStorage.getItem('keep.notes')) {
    notes = JSON.parse(localStorage.getItem('keep.notes'));
  }

  return notes;
}

// Function: Add a note to local storage
function saveNotetoLocalStorage(note) {
  let notes = getNotes();
  notes.push(note);
  localStorage.setItem('keep.notes', JSON.stringify(notes));
}

// Function: remove a note  from local storage
function removeNote(id) {
  let notes = getNotes();
  notes = notes.filter((note) => note.id !== id);
  localStorage.setItem('keep.notes', JSON.stringify(notes));
}

// UI UPDATES
// Function: Create new note in UI
function addNotetoList(note, index = 1) {
  const newUINote = document.createElement('div');
  newUINote.classList.add('note');
  newUINote.setAttribute('data-aos', 'fade-up');
  newUINote.setAttribute('data-aos-delay', index * 100);
  newUINote.innerHTML = `
        <span hidden>${note.id}</span>
        <h2 class="note__title">${note.title}</h2>
        <p class="note__body">${note.body}</p>
        <div class="note__btns">
          <button class="note__btn note__view">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="note__btn note__delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;
  noteContainer.appendChild(newUINote);
}

// Function: Show notes in UI
function showAllNotes() {
  let notes = getNotes();

  notes.forEach((note, index) => {
    addNotetoList(note, index);
  });
}

// Function: Show alert message
function showAlertMessage(message, alertClass) {
  const alertDiv = document.createElement('div');
  alertDiv.classList = `message ${alertClass}`;
  alertDiv.appendChild(document.createTextNode(message));
  form.insertAdjacentElement('beforebegin', alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}
// Function: View note in modal
function openNoteModal(title, body) {
  const modalTitle = document.querySelector('.modal__title');
  const modalBody = document.querySelector('.modal__body');
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.showModal();
}

// Event: Close Modal
document.querySelector('.modal__btn').addEventListener('click', () => {
  modal.close();
});

// Event: sidebar category
categoryContainer.addEventListener('click', (event) => {
  const currentItem = event.target.closest('.category-item');
  id = currentItem.querySelector('.hidden-id').textContent;

  filterNoteByCategory(id);
});

// Event: Note Buttons
noteContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('note__view')) {
    // trigger modal
    const currentNote = event.target.closest('.note');

    const title = currentNote.querySelector('.note__title').textContent;
    const body = currentNote.querySelector('.note__body').textContent;
    // open modal with data
    openNoteModal(title, body);
  }
  if (event.target.classList.contains('note__delete')) {
    // trigger delete fun
    const currentNote = event.target.closest('.note');
    currentNote.remove();
    showAlertMessage('Note deleted successfully', 'remove-message');
    const id = currentNote.querySelector('span').textContent;

    removeNote(Number(id));
  }
});

// Event: Display All Notes at app start
window.addEventListener('DOMContentLoaded', () => {
  showAllNotes();
  showAllCategories();
  if (localStorage.getItem('keep.theme')) {
    theme = localStorage.getItem('keep.theme');
  }
  loadTheme();
});

// Event: Note Form Submit
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const noteInput = document.querySelector('#note');

  if (noteInput.value.length > 0 && titleInput.value.length > 0) {
    const newNote = new Note(
      titleInput.value,
      noteInput.value,
      categoriesInput.value
    );
    // add note to list
    addNotetoList(newNote);
    // save to localStorage
    saveNotetoLocalStorage(newNote);
    // clear form
    titleInput.value = '';
    noteInput.value = '';
    //   show alert message
    showAlertMessage('Note saved successfully', 'success-message');
  } else {
    showAlertMessage('Please fill both inputs', 'alert-message');
  }
});
