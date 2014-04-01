var threeColumns = (function ($) {
    var _commons; 

    var $bodyContainer = $('#bodyContainer');
    var $bodyHeader = $('#bodyHeader');
    var $bodyContentWrapper = $('#bodyContentWrapper');

    var $leftResizeBar = $('#leftResizeBar');
    var $rightResizeBar = $('#rightResizeBar');

    var $leftToggleBtn = $('#leftToggleBtn');
    var $rightToggleBtn = $('#rightToggleBtn');

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

    // toggle elements  
    var toggleElements = function (elements) {
        $.each(elements, function(index, $element) {
            $element.toggle();
        })

        // reset width if to avoid floating element
        // we use scrollHeight and clientHeight to check 
        // the presence of a vertical scroll
        if (elements[0].is(':visible')) {
            var hasVerticalScroll = document.body.scrollHeight
                > document.body.clientHeight;
            if (hasVerticalScroll) {
                setDocWidth();
            }
        }
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

        // set column width the first time
        onWindowResize();

        $(window).resize(onWindowResize);

        $leftToggleBtn.click(function () {
            toggleElements([_commons.$leftPanel, $leftResizeBar]);
        });

        $rightToggleBtn.click(function () {
            toggleElements([_commons.$rightPanel, $rightResizeBar]);
        });
    };

    var exported = {
        initModule: initModule,
        onDocumentReady: onDocumentReady
    };

    return exported;
})(jQuery);