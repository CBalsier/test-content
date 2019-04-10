$(window).bind("load", function() {
    var carousels=bulmaCarousel.attach('.carousel', {
        slidesToShow: 2,
        infinite: true,
        pagination: false
    });
});
