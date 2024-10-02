const formElement = document.querySelector('.img-upload__form');
const hashtagInput = formElement.querySelector('.text__hashtags');
const commentInput = formElement.querySelector('.text__description');
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');
const commentsCountContainer = document.querySelector('.social__comment-count');
const loadMoreButton = document.querySelector('.comments-loader');
let currentCommentsCount = 0;
let commentsData = [];

function openForm() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);
}

function closeForm() {
  formElement.reset();
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeyDown);
}

function onDocumentKeyDown(evt) {
  if (evt.key === 'Escape' && !isInputFocused()) {
    evt.preventDefault();
    closeForm();
  }
}

function isInputFocused() {
  return document.activeElement === hashtagInput || document.activeElement === commentInput;
}

function validateHashtags() {
  const hashtags = hashtagInput.value.trim().toLowerCase().split(/\s+/);
  const regex = /^#[a-zA-Zа-яА-Я0-9]{1,19}$/;
  const uniqueHashtags = new Set();

  if (!hashtagInput.value) {
    hashtagInput.setCustomValidity('');
    return true;
  }

  if (hashtags.length > 5) {
    hashtagInput.setCustomValidity('Нельзя указать больше 5 хэш-тегов.');
    return false;
  }

  const isValid = hashtags.every(tag => {
    if (tag === '#') {
      hashtagInput.setCustomValidity('Хэш-тег не может состоять только из решетки.');
      return false;
    }
    if (!regex.test(tag)) {
      hashtagInput.setCustomValidity('Хэш-тег должен начинаться с # и быть длиной от 2 до 20 символов.');
      return false;
    }
    if (uniqueHashtags.has(tag)) {
      hashtagInput.setCustomValidity('Хэш-теги не должны повторяться.');
      return false;
    }
    uniqueHashtags.add(tag);
    return true;
  });

  if (!isValid) {
    return false;
  }

  hashtagInput.setCustomValidity('');
  return true;
}

function validateComment() {
  if (commentInput.value.length > 140) {
    commentInput.setCustomValidity('Комментарий не должен превышать 140 символов.');
    return false;
  }
  commentInput.setCustomValidity('');
  return true;
}

function checkCommentsCount(comments) {
  if (comments.length === 0) {
    commentsCountContainer.classList.add('hidden');
    loadMoreButton.classList.add('hidden');
  } else {
    commentsCountContainer.classList.remove('hidden');
    const visibleCommentsCount = Math.min(comments.length, currentCommentsCount);
    commentsCountContainer.textContent = `${visibleCommentsCount} из ${comments.length} комментариев`;

    if (visibleCommentsCount === comments.length) {
      loadMoreButton.classList.add('hidden');
    } else {
      loadMoreButton.classList.remove('hidden');
    }
  }
}

function loadMoreComments() {
  currentCommentsCount += 5;
  checkCommentsCount(commentsData);
}

function showBigPicture(photo) {
  commentsData = photo.comments;
  currentCommentsCount = Math.min(commentsData.length, 5);
  checkCommentsCount(commentsData);
}

function allValidation() {
  return validateHashtags() && validateComment();
}

closeButton.addEventListener('click', () => {
  closeForm();
});

fileInput.addEventListener('change', () => {
  openForm();
});

formElement.addEventListener('input', () => {
  allValidation();
});

loadMoreButton.addEventListener('click', () => {
  loadMoreComments();
});

export { allValidation, openForm, closeForm, showBigPicture };





