document.addEventListener("DOMContentLoaded", () => {
    const cont = document.getElementById("yt-selector");

    const trigger = cont.querySelector(".select-trigger");
    const optionul = cont.querySelector(".options");

    const optionils = optionul.querySelectorAll(".option");

    trigger.addEventListener("click", () => {
        cont.classList.toggle("open");
    });
    optionils.forEach((o) => {
        o.addEventListener("click", () => {
            const selectedValue = o.dataset.value;
            const selectedText = o.textContent;

            trigger.querySelector("span").textContent = selectedText;

            optionils.forEach((e) => e.classList.remove("selected"));
            o.classList.add("selected");

            cont.classList.remove("open");

            loadVideoById(selectedValue);
        });
    });

    // close when click other territory
    document.addEventListener("click", (e) => {
        if (!cont.contains(e.target)) {
            cont.classList.remove("open");
        }
    });
});
