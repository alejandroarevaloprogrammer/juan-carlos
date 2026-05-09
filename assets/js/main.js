document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "navbar",
        getAssetPath("../components/navbar.html")
    );

    await loadComponent(
        "footer",
        getAssetPath("../components/footer.html")
    );

    setActiveLink();
    setCopyrightYear();
    initAOS();
    initGifSwiper();
    initProjectModal();

});

// Build paths relative to this JavaScript file.
// This works in Live Server and in GitHub Pages inside /juan-carlos/.
function getAssetPath(relativePath){

    const currentScript =
        document.currentScript ||
        document.querySelector('script[src$="main.js"]');

    if(!currentScript){
        return relativePath;
    }

    return new URL(relativePath, currentScript.src).href;

}

// Load reusable HTML components
async function loadComponent(id, path){

    const element = document.getElementById(id);

    if(!element) return;

    try{

        const response = await fetch(path, {
            cache: "no-cache"
        });

        if(!response.ok){
            throw new Error(`Could not load component: ${path}`);
        }

        element.innerHTML = await response.text();

    }
    catch(error){

        console.error(error);

        element.innerHTML = `
            <div class="container py-3 text-center text-warning">
                Component could not be loaded.
            </div>
        `;

    }

}

// Active navbar link
function setActiveLink(){

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "") || "index";

    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove("active");

        if(link.dataset.page === currentPage){
            link.classList.add("active");
        }

    });

}

// Dynamic copyright
function setCopyrightYear(){

    const year = document.getElementById("copyright-year");

    if(year){
        year.textContent = new Date().getFullYear();
    }

}

// AOS animations
function initAOS(){

    if(typeof AOS === "undefined") return;

    AOS.init({
        duration: 1000,
        once: true
    });

}

// Swiper GIF carousel
function initGifSwiper(){

    if(typeof Swiper === "undefined") return;

    const swiperContainer = document.querySelector(".gameGifSwiper");

    if(!swiperContainer) return;

    new Swiper(".gameGifSwiper", {

        loop: true,

        effect: "fade",

        speed: 1000,

        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        }

    });

}

// Project modal
function initProjectModal(){

    const modal = document.getElementById("projectModal");

    if(!modal) return;

    const openButtons = document.querySelectorAll(".open-project-modal");
    const closeButton = document.getElementById("closeProjectModal");
    const overlay = modal.querySelector(".project-modal-overlay");

    function openModal(event){

        if(event){
            event.preventDefault();
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

    }

    function closeModal(){

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

    }

    openButtons.forEach(button => {

        button.addEventListener("click", openModal);

    });

    if(closeButton){
        closeButton.addEventListener("click", closeModal);
    }

    if(overlay){
        overlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", event => {

        if(event.key === "Escape" && modal.classList.contains("active")){
            closeModal();
        }

    });

}

function initAOS(){

    if(typeof AOS === "undefined") return;

    AOS.init({
        duration: 1000,
        once: true
    });

}


// =========================================
// DYNAMIC MODAL PROJECT SYSTEM
// =========================================

const projects = [

    {
        title: "Tsukiyo: Battle Doll",

        link:"https://store.steampowered.com/app/4204640/Tsukiyo_Battle_Doll/",

        tags: [
            "C#",
            "Unity",
            "Platform",
            "Metroidvania",
            "Hack&Slash"
        ],

        slides: [
            "assets/gifs/tsukiyo/gameplay1.gif",
            "assets/gifs/tsukiyo/gameplay2.gif",
            "assets/gifs/tsukiyo/gameplay3.gif",
            "assets/gifs/tsukiyo/gameplay4.gif",
            "assets/gifs/tsukiyo/gameplay5.gif",
            "assets/gifs/tsukiyo/gameplay6.gif"
        ]
    },

    {
        title: "Advance Wars",

        link:"https://github.com/juancarlosuarez/Advance-Wars-Unity",

        tags: [
            "C#",
            "Unity",
            "Strategy",
            "Tactic Game"
        ],

        slides: [
            "assets/gifs/advancewars/gameplay1.gif",
            "assets/gifs/advancewars/gameplay2.gif",
            "assets/gifs/advancewars/gameplay3.gif",
            "assets/gifs/advancewars/gameplay4.gif",
            "assets/gifs/advancewars/gameplay5.gif",
            "assets/gifs/advancewars/gameplay6.gif",
            "assets/gifs/advancewars/gameplay7.gif",
            "assets/gifs/advancewars/gameplay8.gif"
        ]
    },

    {
        title: "Coffee Game",

        link:null,

        tags: [
            "Unity",
            "Racing",
            "WebGL"
        ],

        slides: [
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=1200",
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=1200"
        ]
    }

];

let currentProjectIndex = 0;
let projectSwiper = null;

function initProjectModal(){

    const modal = document.getElementById("projectModal");

    if(!modal) return;

    document
        .querySelectorAll(".open-project-modal")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();

                openProjectModal(
                    parseInt(button.dataset.project)
                );

            });

        });

    document
        .getElementById("closeProjectModal")
        ?.addEventListener("click", closeProjectModal);

    document
        .querySelector(".project-modal-overlay")
        ?.addEventListener("click", closeProjectModal);

    document
        .getElementById("nextProjectButton")
        ?.addEventListener("click", () => {

            openProjectModal(
                (currentProjectIndex + 1)
                % projects.length
            );

        });

    document
        .getElementById("previousProjectButton")
        ?.addEventListener("click", () => {

            openProjectModal(
                (currentProjectIndex - 1 + projects.length)
                % projects.length
            );

        });

}

function openProjectModal(index){

    currentProjectIndex = index;

    const project = projects[index];

    // =========================================
    // TITLE
    // =========================================

    document.getElementById(
        "modalProjectTitle"
    ).textContent = project.title;

    // =========================================
    // EXTERNAL LINK BUTTON
    // =========================================

    const externalLinkButton =
        document.getElementById(
            "projectExternalLink"
        );

    if(project.link){

        externalLinkButton.href =
            project.link;

        externalLinkButton.style.display =
    "flex";

    }else{

        externalLinkButton.style.display =
            "none";

    }

    // =========================================
    // TAGS
    // =========================================

    const tags =
        document.getElementById(
            "modalProjectTags"
        );

    tags.innerHTML = "";

    project.tags.forEach(tag => {

        const span =
            document.createElement("span");

        span.textContent = tag;

        tags.appendChild(span);

    });

    // =========================================
    // SLIDES
    // =========================================

    const wrapper =
        document.getElementById(
            "modalSwiperWrapper"
        );

    wrapper.innerHTML = "";

    project.slides.forEach(slide => {

        const div =
            document.createElement("div");

        div.className = "swiper-slide";

        div.innerHTML = `
            <img
                src="${slide}"
                class="project-slide-image"
                alt="Project Slide"
            >
        `;

        wrapper.appendChild(div);

    });

    // =========================================
    // RESET SWIPER
    // =========================================

    if(projectSwiper){

        projectSwiper.destroy(
            true,
            true
        );

    }

    projectSwiper =
        new Swiper(".modalProjectSwiper", {

            loop:true,

            speed:900,

            autoplay:{
                delay:3500,
                disableOnInteraction:false
            },

            navigation:{
                nextEl:".swiper-button-next",
                prevEl:".swiper-button-prev"
            }

        });

    // =========================================
    // OPEN MODAL
    // =========================================

    document
        .getElementById("projectModal")
        .classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}

function closeProjectModal(){

    document
        .getElementById("projectModal")
        .classList.remove("active");

    document.body.classList.remove("modal-open");

}

// =========================================
// GAME VIDEO PREVIEW
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const playButton =
        document.getElementById("playVideoButton");

    const video =
        document.getElementById("gameVideo");

    const thumbnail =
        document.getElementById("videoThumbnail");

    if(
        !playButton ||
        !video ||
        !thumbnail
    ) return;

    playButton.addEventListener("click", () => {

        thumbnail.style.display = "none";

        video.style.display = "block";

        video.controls = true;

        video.play();

    });

    video.addEventListener("ended", async () => {

    // Exit fullscreen safely

    if(document.fullscreenElement){

        await document.exitFullscreen();

    }

    // iOS Safari fallback

    if(video.webkitDisplayingFullscreen){

        video.webkitExitFullscreen();

    }

    video.pause();

    video.currentTime = 0;

    video.style.display = "none";

    thumbnail.style.display = "block";

    video.controls = false;

});

});

// =========================================
// GAME 2 VIDEO PREVIEW
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const playButton =
        document.getElementById("playVideoButton1");

    const video =
        document.getElementById("gameVideo1");

    const thumbnail =
        document.getElementById("videoThumbnail1");

    if(
        !playButton ||
        !video ||
        !thumbnail
    ) return;

    playButton.addEventListener("click", () => {

        thumbnail.style.display = "none";

        video.style.display = "block";

        video.controls = true;

        video.play();

    });

    video.addEventListener("ended", async () => {

    // Exit fullscreen safely

    if(document.fullscreenElement){

        await document.exitFullscreen();

    }

    // iOS Safari fallback

    if(video.webkitDisplayingFullscreen){

        video.webkitExitFullscreen();

    }

    video.pause();

    video.currentTime = 0;

    video.style.display = "none";

    thumbnail.style.display = "block";

    video.controls = false;

});

});