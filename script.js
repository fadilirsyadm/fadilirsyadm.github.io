const portfolioGrid = document.getElementById("portfolioGrid");
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
const siteNav = document.getElementById("siteNav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const siteHeader = document.querySelector(".site-header");
const sections = Array.from(document.querySelectorAll("main section[id]"));
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

function cardTemplate(project) {
  const tags = Array.isArray(project.tags)
    ? project.tags.map((tag) => `<span>${tag}</span>`).join("")
    : "";

  const projectUrl = project.url || project.link;
  const openInNewTab = project.newTab !== false;
  const titleMarkup = projectUrl
    ? `<h3><a class="project-title-link" href="${projectUrl}" ${openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ""}>${project.title}</a></h3>`
    : `<h3>${project.title}</h3>`;

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
        ${titleMarkup}
        <p>${project.description}</p>
        <div class="project-tags">${tags}</div>
      </div>
    </article>
  `;
}

function renderProjects(filter = "all") {
  if (!portfolioGrid) return;

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

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

function getNavOffset() {
  return (siteHeader ? siteHeader.offsetHeight : 0) + 28;
}

function updateActiveNav() {
  if (!sections.length || !navLinks.length) return;

  const scrollPosition = window.scrollY + getNavOffset();
  const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (pageBottom) {
    setActiveNav(sections[sections.length - 1].id);
    return;
  }

  let currentSectionId = sections[0].id;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSectionId = section.id;
    }
  });

  setActiveNav(currentSectionId);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = (link.getAttribute("href") || "").replace("#", "");

    if (targetId) {
      setActiveNav(targetId);
    }

    if (siteNav && menuToggle) {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

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

let isTicking = false;
const requestActiveNavUpdate = () => {
  if (isTicking) return;

  isTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    isTicking = false;
  });
};

window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
window.addEventListener("resize", requestActiveNavUpdate);
window.addEventListener("load", updateActiveNav);

document.addEventListener("DOMContentLoaded", updateActiveNav);
updateActiveNav();
