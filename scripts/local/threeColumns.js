var threeColumns = (function ($) {
    var _commons; 

    var $bodyContainer = $("#bodyContainer");
    var $bodyHeader = $('#bodyHeader');
    var $bodyContentWrapper = $("#bodyContentWrapper");

    var leftPanelInitWidth = "30%";
    var rightPanelInitWidth = "30%";

    // ! it is a surprise that an inside element (h1)
    // has a margin of 20px that is not included in 
    // bodyHeader's outerHeight. We use postion's top to get it. 
    var calcBodyHeaderHeight = function () {
        var totalHeight = $bodyHeader.position().top +
            $bodyHeader.outerHeight(true);
        return totalHeight;
    };

    var setDocHeight = function () {
        // height is the inside height excluding paddings
        var docHeight = $bodyContainer.height() -
            calcBodyHeaderHeight();

        // the container doesn't have any margin or border
        $bodyContentWrapper.height(docHeight);
    };

    // during resize, reset to default layout to
    // make the calculation simple
    var setDocWidth = function () {
        _commons.$leftPanel.width(leftPanelInitWidth);
        _commons.$rightPanel.width(rightPanelInitWidth);
    }

    // when window resizes, set height and width to initial values
    var onWindowResize = function () {
        setDocHeight();
        setDocWidth();
    };

    var initModule = function(commons) {
        _commons = commons;
    };

    var onDocumentReady = function () {
        onWindowResize();
        $(window).resize(onWindowResize);
    };

    var exported = {
        initModule: initModule,
        onDocumentReady: onDocumentReady
    };

    return exported;
})(jQuery);