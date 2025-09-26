document.addEventListener('DOMContentLoaded', () => {
  
// establish stars variable that encases .star query selector.
  const stars = document.querySelectorAll('.star');
  let selectedRating = 0;

//  on mouseover, change the content property to star-full.png.
  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
      highlightStars(index);
    });

// on mouseout, revert the content property back to star-empty.png.
    star.addEventListener('mouseout', () => {
      clearStars();
    });

// on click, establish the star rating of the suggestion.
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStars(selectedRating);
    });

// on right-click, reset the star rating to 0.
    star.addEventListener('contextmenu', (e) => {
        selectedRating = 0;
        updateStars(selectedRating);
    });
});

// add the filled class to starts that are being highlighted by user.
  function highlightStars(index) {
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add('filled');
    }
  }

  // clear the filled classlist from stars that are not being highlighted by user.
  function clearStars() {
    stars.forEach((star, i) => {
      if (i >= selectedRating) {
        star.classList.remove('filled');
      }
    });
  }

// update the stars to reflect the selected rating.
  function updateStars(rating) {
    stars.forEach((star, i) => {
      star.classList.toggle('filled', i < rating);
    });
  }

const genItems = document.querySelectorAll('#gen-1, #gen-2, #gen-3, #gen-4');

  genItems.forEach(item => {
    // Left-click to select
    item.addEventListener('click', () => {
      item.classList.add('selected');
    });

    // Right-click to deselect
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Prevent default context menu
      item.classList.remove('selected');
    });
  });





});