console.log("before loading");
window.onload = function() {
    console.log("in function");
    var carousels=bulmaCarousel.attach('.carousel', {
        slidesToShow: 2,
        infinite: true,
        pagination: false
    });
    console.log("carousel loaded: ", carousels);
};
