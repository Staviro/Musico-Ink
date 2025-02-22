const music = {
    open(track, _artist, img, artistModal = "") {
        let modal = document.getElementById("modal-music");
        modal.querySelector(".modal-music-info.track").textContent = track;
        modal.querySelector(".modal-music-info.artist").textContent = _artist;
        modal.querySelector(".modal-music-info.artist").onclick = function() {
            music.close();
            artist.open(artistModal);
        }
        modal.querySelector(".modal-music-cover-img").src = img;

        modal.style.display = "none";
        modal.querySelector(".modal-music-content").style.display = "none";
        modal.querySelector(".modal-music-cover-img").style.display = "none";

        let selector = "#modal-music";
        malo.animate({ element: selector, animation: "fade-in", display: "flex" });
        malo.animate({ element: selector + " .modal-music-content", animation: "pop-in", direction: "right" });
        malo.animate({ element: selector + " .modal-music-cover-img", animation: "fade-in", duration: 1000 });
    },
    close() {
        let selector = "#modal-music";
        malo.animate({ element: selector, animation: "fade-out", display: "flex" });
        malo.animate({ element: selector + " .modal-music-content", animation: "pop-out", direction: "left" });
    }
}