ThreeColumnHtmlPage
===================

A resizable collapsable 3-column html page. There are many design decisions involved in this simple layout. Below is the top level page sckelton. 
    
    <div id="bodyContainer">
        <header class="text-center"></header>

        <section id="bodyContentWrapper">
            <div id="leftPanel"></div>
            <div id="leftResizeBar"></div>

            <!-- the order of element matters due to float direction -->
            <div id="rightPanel"></div>
            <div id="rightResizeBar"></div>

            <!-- the middle panel has to be the last element because 
                block formatting context (BFC) requires it-->
            <div id="middlePanel"></div>
        </section>
    </div>

The first design decision is that we want make the page occupies the whole viewport. We set the body conent wrapper (#bodyContentWrapper) height to the difference of body container height (#bodyContainer) and header height. To use all width, we use a CSS feature called block formatting context (BFC). See [BFC examples] [1]. We set all contents with a width and a float style except the middle panel. By setting the middle panel with a overflow: hidden and without float and width style, we make it a BFC element that takes the rest of width available. Additionally We need to put it in a window resize event handler to set a correct height when a user resizes the window. 

    // register windows resize handler when document is ready
    $(window).resize(onWindowResize);

    // the implementation of onWidnowResize
    var initialLeftPanelWidth = "30%";
    var initialRightPanelWidth = "30%";

    var setDocHeight = function () {
        var docHeight = $('#bodyContainer').height() -
            $('header').outerHeight()
        $('#bodyContentWrapper').outerHeight(docHeight);
    };

    // during resize, reset to default layout to
    // make the calculation simple
    var setDocWidth = function () {
        $("#leftPanel").width(initialLeftPanelWidth);
        $("#rightDocView").width(initialRightPanelWidth);
    }

    var onWindowResize = function () {
        setDocHeight();
        setDocWidth();
    };



[1]: http://www.stubbornella.org/content/2009/07/23/overflow-a-secret-benefit/