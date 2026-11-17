let allMoviesData = null,
  currentUser = JSON.parse(localStorage.getItem("movieUser")) || null,
  currentFilteredMovies = [],
  currentDisplayedCount = 8;


function openPopup(popupName) {
  let popup = document.querySelector(`[data-popup-name="${popupName}"]`);
  if (popup) {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closePopup(popupName) {
  let popup = document.querySelector(`[data-popup-name="${popupName}"]`);
  if (popup) {
    popup.classList.remove("active");
    document.body.style.overflow = "auto";
    if (popupName === "trailer") {
      let iframe = document.getElementById("trailerIframe");
      if (iframe) iframe.src = "";
    }
  }
}

function openTrailer(trailerId) {
  let iframe = document.getElementById("trailerIframe");
  if (iframe) {
    iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
    openPopup("trailer");
  }
}

function prepareStars(rating) {
  let starsHtml = ``,
    starCount = Math.round(rating / 2);

  for (let i = 1; i <= 5; i++) {
    starsHtml +=
      i <= starCount
        ? `<i class="fa-solid fa-star text-warning"></i>`
        : `<i class="fa-regular fa-star text-warning"></i>`;
  }
  return starsHtml;
}

function prepareMovieCard(movie, isSlider = false) {
  let cardHtml = `
        <div class="movie-card">
            <div class="poster-container">
                <img src="./images/${movie.poster}" class="poster" alt="${movie.title}">
            </div>
            <div class="overlay">
                <img src="./images/${movie.logo}" class="logo mb-2" alt="${movie.title} Logo">
                <div class="info text-center w-100 px-3">
                    <h5 class="movie-title text-white mb-1 fw-bold">${movie.title}</h5>
                    <p class="movie-year text-light mb-2 small">${movie.year}</p>
                    <div class="rating mb-3 d-flex justify-content-center align-items-center gap-2">
                        <div>${prepareStars(movie.rating)}</div> 
                        <span class="rating-number text-warning fw-bold">(${movie.rating})</span>
                    </div>
                    <button class="btn w-100 rounded-pill fw-bold" onclick="showMovieDetails(${movie.id})">Details</button>
                </div>
            </div>
        </div>
    `;

  return isSlider
    ? `<div class="item">${cardHtml}</div>`
    : `<div class="col-lg-3 col-md-4 col-sm-6 mb-4 wow animate__fadeInUp">${cardHtml}</div>`;
}

function startHeroBackgroundSlideShow() {
  let backgrounds = allMoviesData
      .map(function (m) {
        return m.background;
      })
      .filter(function (bg) {
        return bg && bg.includes("_back");
      }),
    currentIndex = 0;

  if (backgrounds.length === 0) return;

  $("#homeBackground").css(
    "background-image",
    `url('./images/${backgrounds[currentIndex]}')`,
  );

  setInterval(function () {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    $("#homeBackground").css(
      "background-image",
      `url('./images/${backgrounds[currentIndex]}')`,
    );
  }, 3000);
}

function startAboutPosterSlideShow() {
  let posters = allMoviesData
      .map(function (m) {
        return m.poster;
      })
      .filter(function (p) {
        return p;
      }),
    currentIndex = 0;

  if (posters.length === 0) return;

  $("#aboutPosterSlider").css(
    "background-image",
    `url('./images/${posters[currentIndex]}')`,
  );

  setInterval(function () {
    currentIndex = (currentIndex + 1) % posters.length;
    $("#aboutPosterSlider").css(
      "background-image",
      `url('./images/${posters[currentIndex]}')`,
    );
  }, 2500);
}

function displayLatestSlider() {
  let latestMovies = allMoviesData
      .filter(function (movie) {
        return movie.year >= 2023;
      })
      .slice(0, 10),
    box = ``;

  for (let movie of latestMovies) {
    box += prepareMovieCard(movie, true);
  }

  $("#LatestContent").html(box);
}

function displayTop10() {
  let top10 = [...allMoviesData]
      .sort(function (a, b) {
        return b.rating - a.rating;
      })
      .slice(0, 10),
    box = ``;

  for (let movie of top10) {
    box += prepareMovieCard(movie, true);
  }

  $("#Top10Content").html(box);
}

function setupDynamicCategories() {
  let allTypes = [
      ...new Set(
        allMoviesData.map(function (movie) {
          return movie.type;
        }),
      ),
    ],
    buttonsHtml = `<button class="category-btn active" onclick="filterMovies('All', this)">All</button>`;

  for (let type of allTypes) {
    if (type) {
      buttonsHtml += `<button class="category-btn" onclick="filterMovies('${type}', this)">${type}</button>`;
    }
  }

  $("#categoryMenu").html(buttonsHtml);
  filterMovies("All", $("#categoryMenu").children().first()[0]);
}

function filterMovies(filterType, clickedBtn) {
  $("#categoryMenu .category-btn").removeClass("active");
  if (clickedBtn) $(clickedBtn).addClass("active");

  currentFilteredMovies =
    filterType === "All"
      ? allMoviesData
      : allMoviesData.filter(function (movie) {
          return movie.type === filterType;
        });

  currentDisplayedCount = 8;
  renderCategoryMovies();
}

function renderCategoryMovies() {
  let box = ``,
    moviesToShow = currentFilteredMovies.slice(0, currentDisplayedCount);

  for (let movie of moviesToShow) {
    box += prepareMovieCard(movie, false);
  }

  $("#CategoriesContent").html(box);

  if (currentDisplayedCount < currentFilteredMovies.length) {
    $("#showMoreBtn").removeClass("d-none");
  } else {
    $("#showMoreBtn").addClass("d-none");
  }
}

function loadMoreMovies() {
  currentDisplayedCount += 8;
  renderCategoryMovies();
}

function showMovieDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

function loadDetailsPageData() {
  let urlParams = new URLSearchParams(window.location.search),
    movieId = parseInt(urlParams.get("id"));

  if (!movieId) return;

  let movie = allMoviesData.find(function (m) {
    return m.id === movieId;
  });
  if (!movie) return;

  let detailsBox = `
        <div class="col-md-4 text-center mb-4 mb-md-0">
            <img src="./images/${movie.poster}" class="details-poster img-fluid" alt="${movie.title}">
        </div>
        <div class="col-md-8 text-white details-info d-flex flex-column justify-content-center">
            <img src="./images/${movie.logo}" class="details-logo mb-4" alt="${movie.title} Logo" style="max-width: 250px;">
            <h3 class="text-danger fw-bold">${movie.title}</h3>
            <p class="desc mb-4">${movie.description}</p>
            
            <div class="rating-year mb-4 d-flex align-items-center gap-3">
                <span class="fs-5 fw-bold text-light">${movie.year}</span>
                <div class="fs-5">${prepareStars(movie.rating)}</div>
                <span class="fs-5 text-warning fw-bold">(${movie.rating}/10)</span>
            </div>
            
            <div class="details-actions d-flex flex-wrap gap-3">
                <button class="btn btn-trailer d-flex align-items-center gap-2" onclick="openTrailer('${movie.trailer_id}')">
                    <i class="fa-solid fa-play"></i> Trailer
                </button>
                <button class="btn btn-outline d-flex align-items-center gap-2" id="addToFavBtn"></button>
                <button class="btn btn-outline d-flex align-items-center gap-2" id="addToWatchLaterBtn"></button>
                <a href="index.html" class="btn btn-outline d-flex align-items-center gap-2 text-decoration-none">
                    <i class="fa-solid fa-arrow-left"></i> Back to Home
                </a>
            </div>
            <div class="reviews-section mt-5 w-100">
                <h5 class="text-warning mb-3 border-bottom border-secondary pb-2">User Reviews</h5>
                <div id="reviewsList" class="mb-3"></div>
                <div class="d-flex gap-2">
                    <input type="text" id="reviewInput" class="form-control review-input" placeholder="What do you think about this movie?">
                    <button class="btn btn-warning fw-bold" onclick="addReview(${movie.id})">Post</button>
                </div>
            </div>
        </div>
    `;

  let $container = $("#movieDetailsContainer");
  if ($container.length) {
    $container.html(detailsBox);
    $("#bannerImage").css(
      "background-image",
      `url(./images/${movie.background})`,
    );

    updateFavWatchLaterButtons(movie);
    showRelatedMovies(movie.type, movie.id);
    displayReviews(movie.id);
  }
}

function showRelatedMovies(type, currentMovieId) {
  let related = allMoviesData.filter(function (m) {
      return m.type === type && m.id !== currentMovieId;
    }),
    relatedBox = "";

  for (let movie of related) {
    relatedBox += prepareMovieCard(movie);
  }

  let $slider = $("#RelatedMoviesContent");

  if ($slider.hasClass("owl-loaded")) {
    $slider.trigger("destroy.owl.carousel").removeClass("owl-loaded");
    $slider.find(".owl-stage-outer").children().unwrap();
  }

  $slider.html(relatedBox);

  $slider.owlCarousel({
    margin: 20,
    nav: true,
    dots: true,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
    },
  });
}

function updateFavWatchLaterButtons(movie) {
  let favList = JSON.parse(localStorage.getItem("movieFavs")) || [],
    watchList = JSON.parse(localStorage.getItem("movieWatchLater")) || [],
    $favBtn = $("#addToFavBtn"),
    $watchBtn = $("#addToWatchLaterBtn");

  if (
    favList.find(function (m) {
      return m.id === movie.id;
    })
  ) {
    $favBtn
      .html(`<i class="fa-solid fa-heart text-danger me-1"></i> Favorited`)
      .removeClass("btn-outline-light")
      .addClass("btn-light");
  } else {
    $favBtn
      .html(`<i class="fa-regular fa-heart me-1"></i> Add to Fav`)
      .removeClass("btn-light")
      .addClass("btn-outline-light");
  }

  if (
    watchList.find(function (m) {
      return m.id === movie.id;
    })
  ) {
    $watchBtn
      .html(`<i class="fa-solid fa-bookmark text-danger me-1"></i> Added`)
      .removeClass("btn-outline-light")
      .addClass("btn-light");
  } else {
    $watchBtn
      .html(`<i class="fa-regular fa-bookmark me-1"></i> Watch Later`)
      .removeClass("btn-light")
      .addClass("btn-outline-light");
  }

  $favBtn.off("click").on("click", function () {
    toggleLocalStorageItem("movieFavs", movie);
    updateFavWatchLaterButtons(movie);
  });

  $watchBtn.off("click").on("click", function () {
    toggleLocalStorageItem("movieWatchLater", movie);
    updateFavWatchLaterButtons(movie);
  });
}

function toggleLocalStorageItem(storageKey, movie) {
  if (!currentUser) {
    alert("Please login first!");
    openPopup("authPopup");
    return;
  }

  let list = JSON.parse(localStorage.getItem(storageKey)) || [],
    index = list.findIndex(function (m) {
      return m.id === movie.id;
    });

  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(movie);
  }

  localStorage.setItem(storageKey, JSON.stringify(list));
}

function displayReviews(movieId) {
  let allReviews = JSON.parse(localStorage.getItem("movieReviews")) || {},
    movieReviews = allReviews[movieId] || [],
    box = ``;

  if (movieReviews.length === 0) {
    box = `<p class="text-light mb-0">No reviews yet.</p>`;
  } else {
    for (let review of movieReviews) {
      box += `<div class="review-item mb-2 p-2 border-start border-3 border-info"><div class="fw-bold text-info"><i class="fa-solid fa-user me-2"></i>${review.user}</div><p class="mb-0 text-light">${review.text}</p></div>`;
    }
  }

  $("#reviewsList").html(box);
}

function addReview(movieId) {
  if (!currentUser) return alert("Login to review!");

  let $input = $("#reviewInput"),
    textVal = $input.val().trim(),
    allReviews = JSON.parse(localStorage.getItem("movieReviews")) || {};

  if (textVal === "") return;

  if (!allReviews[movieId]) {
    allReviews[movieId] = [];
  }

  allReviews[movieId].push({
    user: currentUser.name,
    text: textVal,
  });

  localStorage.setItem("movieReviews", JSON.stringify(allReviews));
  $input.val("");
  displayReviews(movieId);
}

function showListInPopup(moviesArray, emptyMessage) {
  let box =
    moviesArray.length === 0
      ? `<div class="col-12 text-center mt-4">${emptyMessage}</div>`
      : ``;

  for (let movie of moviesArray) {
    box += prepareMovieCard(movie, false);
  }

  $("#dynamicListContent").html(box);
}

function handleSearch(term) {
  if (term.trim() === "") {
    $("#dynamicListContent").html("");
    return;
  }

  let filteredMovies = allMoviesData.filter(function (movie) {
    return movie.title.toLowerCase().includes(term.toLowerCase());
  });

  showListInPopup(filteredMovies, "No movies found.");
}

function openDynamicList(type) {
  $("#dynamicListContent").html("");

  if (type === "search") {
    $("#dynamicListTitle").text("Search Movies");
    $("#searchContainer").removeClass("d-none");
    $("#searchInput")
      .focus()
      .off("keyup")
      .on("keyup", function (e) {
        handleSearch(e.target.value);
      });
  } else if (type === "fav") {
    $("#dynamicListTitle").text("Favorites");
    $("#searchContainer").addClass("d-none");
    showListInPopup(
      JSON.parse(localStorage.getItem("movieFavs")) || [],
      "No favorites yet.",
    );
  } else if (type === "watchLater") {
    $("#dynamicListTitle").text("Watch Later");
    $("#searchContainer").addClass("d-none");
    showListInPopup(
      JSON.parse(localStorage.getItem("movieWatchLater")) || [],
      "Watch later is empty.",
    );
  }
  openPopup("dynamicListPopup");
}

function toggleAuth(type) {
  $("#authTitle").text(type === "register" ? "Create Account" : "Login");
  $("#loginForm").toggleClass("d-none", type === "register");
  $("#registerForm").toggleClass("d-none", type !== "register");
}

function updateAuthUI() {
  let currentUser = JSON.parse(localStorage.getItem("movieFlixUser"));

  if (currentUser) {
    $("#navAuthBtn")
      .text(`Logout (${currentUser.name.split(" ")[0]})`)
      .attr("onclick", "handleLogout()");
  } else {
    $("#navAuthBtn").text(`Login`).attr("onclick", "openPopup('authPopup')");
  }
}

function handleLogout() {
  localStorage.removeItem("movieFlixUser");
  updateAuthUI();
}

function validateRegister() {
  let name = $("#regName").val().trim(),
    email = $("#regEmail").val().trim(),
    password = $("#regPassword").val().trim(),
    $errorBox = $("#authErrorMsg"),
    nameRegex = /^[a-zA-Z\u0621-\u064A\s]+$/,
    emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/i,
    users = JSON.parse(localStorage.getItem("movieUsers")) || [];

  $errorBox.addClass("d-none").text("");

  if (!nameRegex.test(name)) {
    $errorBox.text("Name must contain only letters.").removeClass("d-none");
    return;
  }

  if (!emailRegex.test(email)) {
    $errorBox
      .text("Email must end with @gmail.com or @yahoo.com.")
      .removeClass("d-none");
    return;
  }

  if (password.length < 6) {
    $errorBox
      .text("Password must be at least 6 characters long.")
      .removeClass("d-none");
    return;
  }

  if (
    users.some(function (user) {
      return user.email === email;
    })
  ) {
    $errorBox
      .text("This email is already registered! Please Login.")
      .removeClass("d-none");
    return;
  }

  users.push({ name: name, email: email, password: password });
  localStorage.setItem("movieUsers", JSON.stringify(users));

  alert("Account Created Successfully! You can login now.");
  $("#regName, #regEmail, #regPassword").val("");
  toggleAuth("login");
}

function validateLogin() {
  let email = $("#loginEmail").val().trim(),
    password = $("#loginPassword").val().trim(),
    $errorBox = $("#loginErrorMsg"),
    users = JSON.parse(localStorage.getItem("movieUsers")) || [],
    validUser = users.find(function (user) {
      return user.email === email && user.password === password;
    });

  $errorBox.addClass("d-none").text("");

  if (email === "" || password === "") {
    $errorBox
      .text("Please enter both email and password.")
      .removeClass("d-none");
    return;
  }

  if (validUser) {
    alert("Welcome back, " + validUser.name + "!");
    localStorage.setItem("movieFlixUser", JSON.stringify(validUser));
    $("#loginEmail, #loginPassword").val("");
    closePopup("authPopup");
    updateAuthUI();
  } else {
    $errorBox.text("Invalid email or password!").removeClass("d-none");
  }
}
