const album = {
    open(selector) {
        let modal = document.querySelector(selector);
        modal.style.display = "none"
        modal.querySelector(".modal-album-content").style.display = "none";
        document.querySelector(".album-track-unavailable").style.display = "none";
        malo.animate({ element: selector, animation: "fade-in", display: "flex" });
        malo.animate({ element: selector + " .modal-album-content", animation: "float-in", direction: "up" });
    },
    close(selector) {
        malo.animate({ element: selector, animation: "fade-out" });
        malo.animate({ element: selector + " .modal-album-content", animation: "float-out", direction: "up" });
        malo.animate({ element: ".modal-album-content", animation: "slide-out", axis: "y" });
    },
    trackUnavailable() {
        malo.animate({ element: ".album-track-unavailable", animation: "slide-in", axis: "y" });
    }
}