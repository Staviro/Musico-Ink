const artist = {
    open(selector) {
        let modal = document.querySelector(selector);
        modal.style.display = "none"
        modal.querySelector(".modal-artist-content").style.display = "none";

        malo.animate({ element: selector, animation: "fade-in", display: "flex" });
        malo.animate({ element: selector + " .modal-artist-content", animation: "pop-in", direction: "down" });
    },
    close(selector) {
        malo.animate({ element: selector, animation: "fade-out" });
        malo.animate({ element: selector + " .modal-artist-content", animation: "pop-out", direction: "down" });
    }
}