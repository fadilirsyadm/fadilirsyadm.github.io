
const portfolioGrid = document.getElementById("portfolioGrid");
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
const siteNav = document.getElementById("siteNav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

function cardTemplate(project) {
  const tags = project.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  return `
    <article class="project-card" data-category="${project.category}">
      <div class="project-thumb">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="badge">${project.category}</span>
          <small>${project.year}</small>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${tags}</div>
      </div>
    </article>
  `;
}

function renderProjects(filter = "all") {
  const filtered = filter === "all"
    ? projects
    : projects.filter((project) => project.category === filter);

  portfolioGrid.innerHTML = filtered.map(cardTemplate).join("");
}

function setActiveFilter(button) {
  filterButtons.forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    setActiveFilter(button);
    renderProjects(filter);
  });
});

renderProjects();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  });
}, {
  threshold: 0.34,
  rootMargin: "-20% 0px -45% 0px"
});

sections.forEach((section) => sectionObserver.observe(section));
