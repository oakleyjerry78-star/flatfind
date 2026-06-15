document.querySelectorAll(".legal-document").forEach((documentElement) => {
  const headings = Array.from(documentElement.children).filter((element) => element.tagName === "H2");

  headings.forEach((heading) => {
    const section = document.createElement("details");
    const summary = document.createElement("summary");
    const title = document.createElement("span");
    const icon = document.createElement("i");
    const content = document.createElement("div");

    section.className = "legal-section";
    content.className = "legal-section__content";
    title.innerHTML = heading.innerHTML;
    icon.setAttribute("aria-hidden", "true");
    summary.append(title, icon);
    section.append(summary, content);

    let nextElement = heading.nextElementSibling;
    documentElement.insertBefore(section, heading);
    heading.remove();

    while (nextElement && nextElement.tagName !== "H2") {
      const followingElement = nextElement.nextElementSibling;
      content.append(nextElement);
      nextElement = followingElement;
    }

    section.addEventListener("toggle", () => {
      if (!section.open) return;

      documentElement.querySelectorAll(".legal-section[open]").forEach((openSection) => {
        if (openSection !== section) openSection.removeAttribute("open");
      });
    });
  });

  documentElement.classList.add("is-ready");
});
