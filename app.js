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
    this.id = Math.floor(Math.random() * 2000);
  }
}

// Saving to localStorage
// Function: Retreive notes from local storage

// Function: Add a note to local storage

// Function: remove a note  from local storage

// UI UPDATES
// Function: Create new note in UI
function addNotetoList(note) {
  const newUINote = document.createElement('div');
  newUINote.classList.add('note');
  newUINote.innerHTML = `
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

// Function: Show alert message

// Function: View note in modal

// Event: Close Modal

// Event: Note Buttons

// Event: Display Notes

// Event: Note Form Submit
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const noteInput = document.querySelector('#note');
  //   console.log(noteInput.value);
  if (noteInput.value.length > 0 && titleInput.value.length > 0) {
    const newNote = new Note(titleInput.value, noteInput.value);
    // add note to list
    addNotetoList(newNote);
    // save to localStorage
    // clear form
    titleInput.value = '';
    noteInput.value = '';
    //   show alert message
  } else {
    console.log('not pass');
  }
});
