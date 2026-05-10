/**
 * Main JavaScript controller for the portfolio.
 *
 * Responsibilities:
 * - Load shared HTML components.
 * - Highlight the active navigation link.
 * - Initialize UI libraries.
 * - Manage project modals and media previews.
 */

/* =========================================
   Shared component loader
========================================= */

/**
 * Loads an external HTML fragment into a target element.
 *
 * @param {string} id - Target element ID.
 * @param {string} path - Component path.
 */
async function loadComponent(id, path){

    const element = document.getElementById(id);

    if(!element) return;

    try{

        const response = await fetch(path, {
            cache:"no-cache"
        });

        if(!response.ok){
            throw new Error(`Could not load component: ${path}`);
        }

        element.innerHTML = await response.text();

    }catch(error){

        console.error(error);

        element.innerHTML = `
            <div class="container py-3 text-center text-warning">
                Component could not be loaded.
            </div>
        `;

    }

}

/* =========================================
   Navigation state
========================================= */

/**
 * Adds the active state to the current page link.
 */
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

/* =========================================
   Dynamic footer year
========================================= */

/**
 * Keeps the footer copyright year up to date.
 */
function setCopyrightYear(){

    const yearElement =
        document.getElementById("copyrightYear") ||
        document.getElementById("copyright-year");

    if(!yearElement) return;

    yearElement.textContent = new Date().getFullYear();

}

/* =========================================
   Animation initialization
========================================= */

/**
 * Initializes AOS animations when the library is available.
 */
function initAOS(){

    if(typeof AOS === "undefined") return;

    AOS.init({
        duration:1000,
        once:true
    });

}

/* =========================================
   Optional card swiper initialization
========================================= */

/**
 * Initializes legacy GIF swipers if they exist on the page.
 */
function initGifSwiper(){

    if(typeof Swiper === "undefined") return;

    document.querySelectorAll(".gameGifSwiper").forEach(swiperContainer => {

        new Swiper(swiperContainer, {
            loop:true,
            effect:"fade",
            speed:1000,
            autoplay:{
                delay:3500,
                disableOnInteraction:false
            }
        });

    });

}

/* =========================================
   Project data
========================================= */

const projects = [

    {
        title:"Tsukiyo: Battle Doll",

        link:"https://store.steampowered.com/app/4204640/Tsukiyo_Battle_Doll/",

        tags:[
            "C#",
            "Unity",
            "Platform",
            "Metroidvania",
            "Hack&Slash"
        ],

        slides:[
            "assets/gifs/tsukiyo/gameplay1.gif",
            "assets/gifs/tsukiyo/gameplay2.gif",
            "assets/gifs/tsukiyo/gameplay3.gif",
            "assets/gifs/tsukiyo/gameplay4.gif",
            "assets/gifs/tsukiyo/gameplay5.gif",
            "assets/gifs/tsukiyo/gameplay6.gif"
        ]
    },

    {
        title:"Advance Wars",

        link:"https://github.com/juancarlosuarez/Advance-Wars-Unity",

        tags:[
            "C#",
            "Unity",
            "Strategy",
            "Tactic Game"
        ],

        slides:[
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
        title:"Coffee Game",

        link:null,

        tags:[
            "Unity",
            "Racing",
            "WebGL"
        ],

        slides:[
            "assets/img/coffee/gameplay1.png",
            "assets/img/coffee/gameplay2.png",
            "assets/img/coffee/gameplay3.png",
            "assets/img/coffee/gameplay4.png",
            "assets/img/coffee/gameplay5.png"
        ]
    }

];

let currentProjectIndex = 0;
let projectSwiper = null;

/* =========================================
   Project modal
========================================= */

/**
 * Initializes all project modal triggers and controls.
 */
function initProjectModal(){

    const modal = document.getElementById("projectModal");

    if(!modal) return;

    document.querySelectorAll(".open-project-modal").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const projectIndex = Number.parseInt(button.dataset.project, 10);

            if(Number.isNaN(projectIndex)) return;

            openProjectModal(projectIndex);

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
                (currentProjectIndex + 1) % projects.length
            );

        });

    document
        .getElementById("previousProjectButton")
        ?.addEventListener("click", () => {

            openProjectModal(
                (currentProjectIndex - 1 + projects.length) % projects.length
            );

        });

    document.addEventListener("keydown", event => {

        if(
            event.key === "Escape" &&
            modal.classList.contains("active")
        ){
            closeProjectModal();
        }

    });

}

/**
 * Opens the modal and renders the selected project.
 *
 * @param {number} index - Project index.
 */
function openProjectModal(index){

    const project = projects[index];

    if(!project) return;

    currentProjectIndex = index;

    renderProjectTitle(project);
    renderProjectTags(project);
    renderProjectSlides(project);
    renderProjectLink(project);
    resetProjectSwiper();
    showProjectModal();

}

/**
 * Renders the current project title.
 *
 * @param {object} project - Project data.
 */
function renderProjectTitle(project){

    const titleElement = document.getElementById("modalProjectTitle");

    if(!titleElement) return;

    titleElement.textContent = project.title;

}

/**
 * Renders the current project tag list.
 *
 * @param {object} project - Project data.
 */
function renderProjectTags(project){

    const tagsContainer = document.getElementById("modalProjectTags");

    if(!tagsContainer) return;

    tagsContainer.innerHTML = "";

    project.tags.forEach(tag => {

        const tagElement = document.createElement("span");

        tagElement.textContent = tag;

        tagsContainer.appendChild(tagElement);

    });

}

/**
 * Renders the current project carousel slides.
 *
 * @param {object} project - Project data.
 */
function renderProjectSlides(project){

    const wrapper = document.getElementById("modalSwiperWrapper");

    if(!wrapper) return;

    wrapper.innerHTML = "";

    project.slides.forEach(slide => {

        const slideElement = document.createElement("div");

        slideElement.className = "swiper-slide";

        slideElement.innerHTML = `
            <img
                src="${slide}"
                class="project-slide-image"
                alt="Project Slide"
            >
        `;

        wrapper.appendChild(slideElement);

    });

}

/**
 * Shows or hides the external project link.
 *
 * @param {object} project - Project data.
 */
function renderProjectLink(project){

    const externalLinkButton = document.getElementById("projectExternalLink");

    if(!externalLinkButton) return;

    if(project.link){

        externalLinkButton.href = project.link;
        externalLinkButton.style.display = "flex";

    }else{

        externalLinkButton.style.display = "none";

    }

}

/**
 * Recreates the Swiper instance after replacing slide content.
 */
function resetProjectSwiper(){

    if(typeof Swiper === "undefined") return;

    if(projectSwiper){

        projectSwiper.destroy(true, true);

    }

    projectSwiper = new Swiper(".modalProjectSwiper", {
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

}

/**
 * Displays the project modal.
 */
function showProjectModal(){

    const modal = document.getElementById("projectModal");

    if(!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

}

/**
 * Closes the project modal.
 */
function closeProjectModal(){

    const modal = document.getElementById("projectModal");

    if(!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

}

/* =========================================
   Game video previews
========================================= */

/**
 * Initializes click-to-play video previews.
 *
 * Videos are created only after user interaction to prevent
 * native mobile browsers from drawing their default play overlays.
 */
function initGameVideoPreviews(){

    document
        .querySelectorAll(".game-main-media[data-video-src]")
        .forEach(media => {

            const playButton = media.querySelector(".play-video-button");
            const previewImage = media.querySelector(".game-preview-image");
            const videoSrc = media.dataset.videoSrc;

            if(!playButton || !previewImage || !videoSrc) return;

            playButton.addEventListener("click", () => {

                const video = createPreviewVideo(videoSrc);

                previewImage.style.display = "none";
                playButton.style.display = "none";

                media.appendChild(video);

                video.play();

                video.addEventListener("ended", async () => {

                    await safelyExitFullscreen(video);

                    video.pause();
                    video.remove();

                    previewImage.style.display = "block";
                    playButton.style.display = "flex";

                });

            });

        });

}

/**
 * Creates a video element for a game preview.
 *
 * @param {string} src - Video source URL.
 * @returns {HTMLVideoElement}
 */
function createPreviewVideo(src){

    const video = document.createElement("video");

    video.className = "game-main-video";
    video.src = src;
    video.controls = true;
    video.playsInline = true;

    video.setAttribute("controlslist", "nodownload noplaybackrate");
    video.setAttribute("disablepictureinpicture", "");

    return video;

}

/**
 * Safely exits fullscreen mode before removing a video element.
 *
 * @param {HTMLVideoElement} video - Active video element.
 */
async function safelyExitFullscreen(video){

    try{

        if(document.fullscreenElement){

            await document.exitFullscreen();

        }

        if(video.webkitDisplayingFullscreen){

            video.webkitExitFullscreen();

        }

    }catch(error){

        console.log(error);

    }

}

/* =========================================
   Application bootstrap
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "navbar",
        "assets/components/navbar.html"
    );

    await loadComponent(
        "footer",
        "assets/components/footer.html"
    );

    setActiveLink();
    setCopyrightYear();
    initAOS();
    initGifSwiper();
    initProjectModal();
    initGameVideoPreviews();

});
