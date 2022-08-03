// global selectors
const noteContainer = document.querySelector('.note-container');
const modal = document.querySelector('#modal');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');

// Class: for creating a  new  note
class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = Math.random();
  }
}

// Saving to localStorage
// Function: Retreive notes from local storage
function getNotes() {
  let notes;
  if (localStorage.getItem('keep.notes') === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('keep.notes'));
  }
  return notes;
}

// Function: Add a note to local storage
function addNotesToLocalStorage(note) {
  const notes = getNotes();
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
function addNoteToList(note) {
  const newUINote = document.createElement('div');
  newUINote.classList.add('note');
  newUINote.innerHTML = `
    <span hidden>${note.id}</span>
    <h2 class="note__title">${note.title}</h2>
    <p class="note__body">${note.body}</p>
    <div class="note__btns">
      <button class="note__btn note__view"><i class="fa-solid fa-eye"></i></button>
      <button class="note__btn note__delete"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;
  noteContainer.appendChild(newUINote);
}

// Function: Show notes in UI
function displayNotes() {
  const notes = getNotes();
  notes.forEach((note) => {
    addNoteToList(note);
  });
}

// Function: Show alert message
function showAlertMessage(message, alertClass) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `message ${alertClass}`;
  alertDiv.appendChild(document.createTextNode(message));
  form.insertAdjacentElement('beforebegin', alertDiv);
  titleInput.focus();
  setTimeout(() => alertDiv.remove(), 2000);
}

// Function: View note in modal
function activateNoteModal(title, body) {
  const modalTitle = document.querySelector('.modal__title');
  const modalBody = document.querySelector('.modal__body');
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.showModal();
  console.log('show');
}

// Event: Close Modal
const modalBtn = document
  .querySelector('.modal__btn')
  .addEventListener('click', () => {
    modal.close();
  });

// Event: Note Buttons
noteContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('note__view')) {
    const currentNote = e.target.closest('.note');
    const currentTitle = currentNote.querySelector('.note__title').textContent;
    const currentBody = currentNote.querySelector('.note__body').textContent;
    activateNoteModal(currentTitle, currentBody);
  }
  if (e.target.classList.contains('note__delete')) {
    const currentNote = e.target.closest('.note');
    showAlertMessage('Your note was permanently deleted', 'remove-message');
    currentNote.remove();
    const id = currentNote.querySelector('span').textContent;
    removeNote(Number(id));
  }
});

// Event: Display Notes
document.addEventListener('DOMContentLoaded', displayNotes);

// Event: Note Form Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const noteInput = document.querySelector('#note');

  // validate inputs
  if (titleInput.value.length > 0 && noteInput.value.length > 0) {
    const newNote = new Note(titleInput.value, noteInput.value);
    addNoteToList(newNote);
    addNotesToLocalStorage(newNote);
    titleInput.value = '';
    noteInput.value = '';
    showAlertMessage('Note successfully added', 'success-message');
    titleInput.focus();
  } else {
    showAlertMessage('Please add title and note body', 'alert-message');
  }
});
