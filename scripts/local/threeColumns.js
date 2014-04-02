var threeColumns = (function ($) {
    var _commons,       // imported object
        $bodyContainer = $('#bodyContainer'),
        $bodyHeader = $('#bodyHeader'),
        $bodyContentWrapper = $('#bodyContentWrapper'),

        $leftResizeBar = $('#leftResizeBar'),
        $rightResizeBar = $('#rightResizeBar'),

        $leftToggleBtn = $('#leftToggleBtn'),
        $rightToggleBtn = $('#rightToggleBtn'),

        leftPanelInitWidth = "30%",
        rightPanelInitWidth = "30%",

        setDocHeight, setDocWidth, 
        toggleElements, onWindowResize,

        initModule, onDocumentReady, exported
    ;

    setDocHeight = function () {
        var body_header_height, doc_height;
        
        // ! it is a surprise that an inside element (h1)
        // has a margin of 20px that is not included in 
        // bodyHeader's outerHeight. We use postion's top to get it. 
        body_header_height = $bodyHeader.position().top +
            $bodyHeader.outerHeight(true);

        // height is the inside height excluding paddings
        var doc_height = $bodyContainer.height() - body_header_height;

        // the container doesn't have any margin or border
        $bodyContentWrapper.height(doc_height);
    };

    // during resize, reset to default layout to
    // make the calculation simple
    setDocWidth = function () {
        _commons.$leftPanel.width(leftPanelInitWidth);
        _commons.$rightPanel.width(rightPanelInitWidth);
    }


    // toggle elements  
    toggleElements = function (elements) {
        var has_vertical_scroll;

        $.each(elements, function(index, $element) {
            $element.toggle();
        })

        // reset width if to avoid floating element
        // we use scrollHeight and clientHeight to check 
        // the presence of a vertical scroll
        if (elements[0].is(':visible')) {
            has_vertical_scroll = $(document).height()
                > $(window).height();
            if (has_vertical_scroll) {
                setDocWidth();
            }
        }
    };

    // when window resizes, set height and width to initial values
    onWindowResize = function () {
        setDocHeight();
        setDocWidth();
    };

    initModule = function(commons) {
        _commons = commons;
    };

    onDocumentReady = function () {

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

    exported = {
        initModule: initModule,
        onDocumentReady: onDocumentReady
    };

    return exported;
})(jQuery);