(async function () {
  try {
    let res = await fetch("https://zoma57.github.io/movie_project/movies.json"),
      data = await res.json();

    allMoviesData = data.AllMovies;

    if (window.location.pathname.includes("details.html")) {
      loadDetailsPageData();
    } else {
      startHeroBackgroundSlideShow();
      startAboutPosterSlideShow();
      displayLatestSlider();
      displayTop10();
      setupDynamicCategories();
      initOwlCarousels();
    }

    updateAuthUI();
  } catch (error) {
    console.log("Error fetching movies:", error);
  }
})();

$(".popup .box").click(function (e) {
  e.stopPropagation();
});

$(document).on("click", function (e) {
  if ($(e.target).closest(".navbar-toggler").length) {
    return;
  }
  if ($(e.target).hasClass("popup")) {
    let popupName = $(e.target).attr("data-popup-name");
    if (popupName) closePopup(popupName);
  }
});

$(window).scroll(function () {
  $("nav.navbar").toggleClass("scrolled", window.scrollY >= 10);

  let $sections = $("header, section[id]");

  $sections.each(function (index, section) {
    let $section = $(section),
      sectionId = $section.attr("id"),
      sectionTop = $section.offset().top,
      sectionBottom = sectionTop + $section.outerHeight(true),
      navbarHeight = $("nav.navbar").outerHeight(true) || 0,
      scrollY = window.scrollY + navbarHeight + 50;

    if (scrollY > sectionTop && scrollY < sectionBottom) {
      $(`.nav-link.active`).removeClass("active");
      $(`.nav-link[href="#${sectionId}"]`).addClass("active");
    }
  });

  if ($(window).scrollTop() >= 200) {
    $("#Top").css("right", "20px");
  } else {
    $("#Top").css("right", "-100px");
  }
});

$(window).on("load", function () {
  $(".loadingScreen").fadeOut(1000, function () {
    $("body").css("overflow-y", "auto");
  });
});

new WOW({
  animateClass: "animate__animated",
}).init();

function initOwlCarousels() {
  $("#LatestContent").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 3000,
    slideTransition: "linear",
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1000: { items: 4 },
    },
  });

  $("#Top10Content").owlCarousel({
    center: true,
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      768: { items: 3 },
      1200: { items: 3 },
    },
  });
}

$(document).ready(function () {
  $("#registerForm").submit(function (e) {
    e.preventDefault();
    validateRegister();
  });

  $("#loginForm").submit(function (e) {
    e.preventDefault();
    validateLogin();
  });

  $(".search-icon").click(function (e) {
    e.preventDefault();
    openDynamicList("search");
  });

  $(".fav-icon").click(function (e) {
    e.preventDefault();
    openDynamicList("fav");
  });

  $(".watch-later-icon").click(function (e) {
    e.preventDefault();
    openDynamicList("watchLater");
  });
});
