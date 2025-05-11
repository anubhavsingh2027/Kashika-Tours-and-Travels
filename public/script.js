document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const slideshow = document.querySelector('.slideshow');
  const indicatorsContainer = document.querySelector('.indicators');
  let currentSlide = 0;
  slides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      indicator.dataset.index = index;
      if (index === 0) indicator.classList.add('active');
      indicatorsContainer.appendChild(indicator);
  });
  function showSlide(index) {
      if (index < 0) {
          currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
          currentSlide = 0;
      } else {
          currentSlide = index;
      }
      slideshow.style.transform = `translateX(-${100 * currentSlide}vw)`;
      const activeIndicator = indicatorsContainer.querySelector('.active');
      activeIndicator.classList.remove('active');
      indicatorsContainer.children[currentSlide].classList.add('active');
  }
  let autoSlideInterval = setInterval(function () {
      showSlide(currentSlide + 1);
  }, 5000);
  indicatorsContainer.addEventListener('click', function (e) {
      if (e.target && e.target.classList.contains('indicator')) {
          clearInterval(autoSlideInterval);
          showSlide(Number(e.target.dataset.index));
          autoSlideInterval = setInterval(function () {
              showSlide(currentSlide + 1);
          }, 5000);
      }
  });
  showSlide(0);
});
 function toggleNav() {
    const nav = document.querySelector('.mobile-nav-links');
    nav.classList.toggle('active');
  }

  function disableNavLinks() {
    const nav = document.querySelector('.mobile-nav-links');
    nav.classList.remove('active');
  }

document.addEventListener("input", (event) => {
  if (event.target.tagName === "TEXTAREA") {
      autoResizeTextarea(event.target);
  }
});
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("yourFormId");
    const loader = document.getElementById("loader");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the default form submission
      loader.style.display = "block"; // Show the loader
  
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      fetch("/book-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(() => {
        loader.style.display = "none"; // Hide the loader
        form.reset(); // Reset the form fields
      })
      .catch(error => {
        loader.style.display = "none"; // Hide the loader
        console.error("Error:", error);
      });
    });
  });
  // BOOK PACKAGE FORM
document.getElementById("bookForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = document.getElementById("bookSubmitBtn");
  btn.disabled = true;

  const formData = {
    name: this.name.value,
    mobile: this.mobile.value,
    email: this.email.value,
    city: this.city.value,
    date: this.date.value,
    adults: this.adults.value,
    children: this.children.value,
    message: this.message.value
  };

  try {
    const response = await fetch("/book-package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    alert(result.message || "Submission completed.");
  } catch (err) {
    alert("Error submitting the form.");
  } finally {
    btn.disabled = false;
    this.reset();
  }
});
// BOOK PACKAGE FORM END
