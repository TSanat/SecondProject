document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('movieModal');
  const closeButton = document.querySelector('.close-btn');

  // Function to close the modal
  const closeModal = () => {
    modal.style.display = 'none'; // Hide the modal
  };

  // Attach the close button event listener after modal content is injected
  function attachCloseButton() {
    const closeButton = document.querySelector('.close-btn');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
  }

  // Optional: Close the modal when clicking outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Fetch data for Movies
  async function loadMovies() {
    try {
      const response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&primary_release_date.lte=' + new Date().toISOString().split('T')[0] + '&api_key=940bd7b3a3bd75c839464accf9401226');
      const data = await response.json();
      const movieScroll = document.getElementById('movieScroll');
      movieScroll.innerHTML = ''; // Clear previous content

      data.results.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        movieItem.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <div class="genre">Genre: ${movie.genre_ids.join(', ')}</div>
          <div class="rating">Rating: ${movie.vote_average}</div>
          <div class="year">Release Year: ${new Date(movie.release_date).getFullYear()}</div>
        `;

        // Open modal on click
        movieItem.addEventListener('click', () => {
          openModal(movie);
        });

        movieScroll.appendChild(movieItem);
      });
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  // Fetch data for Cartoons
  async function loadCartoons() {
    try {
      const response = await fetch('https://api.themoviedb.org/3/discover/movie?with_genres=16&sort_by=popularity.desc&primary_release_date.lte=' + new Date().toISOString().split('T')[0] + '&api_key=940bd7b3a3bd75c839464accf9401226');
      const data = await response.json();
      const cartoonScroll = document.getElementById('cartoonScroll');
      cartoonScroll.innerHTML = ''; // Clear previous content

      data.results.forEach(cartoon => {
        const cartoonItem = document.createElement('div');
        cartoonItem.classList.add('movie-item');

        cartoonItem.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${cartoon.poster_path}" alt="${cartoon.title}">
          <h3>${cartoon.title}</h3>
          <div class="genre">Genre: Animation</div>
          <div class="rating">Rating: ${cartoon.vote_average}</div>
          <div class="year">Release Year: ${new Date(cartoon.release_date).getFullYear()}</div>
        `;

        // Open modal on click
        cartoonItem.addEventListener('click', () => {
          openModal(cartoon);
        });

        cartoonScroll.appendChild(cartoonItem);
      });
    } catch (error) {
      console.error('Error loading cartoons:', error);
    }
  }

  // Fetch data for TV Series
  async function loadTVSeries() {
    try {
      const response = await fetch('https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&first_air_date.lte=' + new Date().toISOString().split('T')[0] + '&api_key=940bd7b3a3bd75c839464accf9401226');
      const data = await response.json();
      const tvSeriesScroll = document.getElementById('tvSeriesScroll');
      tvSeriesScroll.innerHTML = ''; // Clear previous content

      data.results.forEach(tvSeries => {
        const tvSeriesItem = document.createElement('div');
        tvSeriesItem.classList.add('movie-item');

        tvSeriesItem.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${tvSeries.poster_path}" alt="${tvSeries.name}">
          <h3>${tvSeries.name}</h3>
          <div class="genre">Genre: ${tvSeries.genre_ids.join(', ')}</div>
          <div class="rating">Rating: ${tvSeries.vote_average}</div>
          <div class="year">Release Year: ${new Date(tvSeries.first_air_date).getFullYear()}</div>
        `;

        // Open modal on click
        tvSeriesItem.addEventListener('click', () => {
          openModal(tvSeries);
        });

        tvSeriesScroll.appendChild(tvSeriesItem);
      });
    } catch (error) {
      console.error('Error loading TV series:', error);
    }
  }

  // Function to open the modal and display movie details
  function openModal(item) {
    const modalContent = document.querySelector('.modal-content');
    modal.style.display = 'flex'; // Show modal

    modalContent.innerHTML = `
      <span class="close-btn">&times;</span>
      <div class="modal-info">
        <div class="modal-left">
          <img class="modal-img" src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
        </div>
        <div class="modal-flex">
          <h2>${item.title || item.name}</h2>
          <div><strong>Release Year:</strong> ${new Date(item.release_date || item.first_air_date).getFullYear()}</div>
          <div><strong>Country:</strong> ${item.origin_country ? item.origin_country.join(', ') : 'N/A'}</div>
          <div><strong>Genre:</strong> ${item.genre_ids ? item.genre_ids.join(', ') : 'N/A'}</div>
          <div><strong>Director:</strong> ${item.director || 'N/A'}</div>
          <div><strong>Actors:</strong> ${item.actors || 'N/A'}</div>
        </div>
      </div>

      <div>
        <strong>About:</strong>
        <p>${item.overview || 'No description available.'}</p>
      </div>
    `;

    // Re-attach the close button event listener
    attachCloseButton();
  }

  // Load Movies, Cartoons, and TV Series
  loadMovies();
  loadCartoons();
  loadTVSeries();
});
