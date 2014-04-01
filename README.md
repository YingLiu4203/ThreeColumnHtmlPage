ThreeColumnHtmlPage
===================

This projects implements a resizable and collapsable 3-column html page. The page uses all vertical and horizontal page space and does not scroll unless min-width or min-width is reached. Below is the top level page skeleton. 
    
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

To make the page occupies the whole viewport. We set the body conent wrapper (#bodyContentWrapper) height to the difference of body container height (#bodyContainer) and header height. It is a small surprise that an inside element (h1) has a margin of 20px that is not included in  bodyHeader's outerHeight. We need to use postion's top to make the calculation right.  

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

To use all width, we use a CSS feature called block formatting context (BFC). See [BFC examples] [1]. We set all contents with a width and a float style except the middle panel. By setting the middle panel with a overflow: hidden and without float and width style, we make it a BFC element that takes the rest of width available. Additionally we need to reset width and height in a window resize event handler to keep the page occupying the full window view port.

There is another reason to make the middle panel a BFC element: we only need to change the width of one panel during column reszing. When a user drags a left (right) bar, only the left (right) panel needs changing width. 

The resizeColumn.js implements the column resizing function. The algorithm is straightforward: when a user drags the resize bar, we calculate a dragging distance that keed the left or right panel not narrow than its minimum width. Then we change the width of left or right panel width accordingly. However, there are two little suprises in our tests. First, the resize bar is floating left (for the left resize bar) or right (for the right resize bar). When the left panel or the right chanel width changes, jQuery UI adjusts the stop position of the dragging resize bar. As a result, the resize bar stops at a wrong position. In the code, we fix the resizing bar position before change panel width. Another suprise is that an element's offset is a decimal. There is a rounding issue that may cause the distance calculating missing one or two pixels. We simly add two pixels to the minimu panel width to fix this issue. 

There is a corner issue in collapsable implementation. When a user first makes the right panel wider (for example, more than 50% of the screen width) and hide it. Then the user makes the left panel wider (for example, more than 50% of the screen width), when the user shows the right panel, there is not enough space for the right panel and it float to below the left and middle panel. A simple solution to fix this issue is to reset panel widths to their original values in such a situation. The following code is executed when a user make a hidden element visible. 
    
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

We implement this customized 3-column page because the [jQuery UI Layout plugin] [2] looks to heavy for us. An interesting question is if there is a much easier approach to implement a resizeable and collapsable 3-column page. We might try flexbox layout in the future. 


[1]: http://www.stubbornella.org/content/2009/07/23/overflow-a-secret-benefit/

[2]: http://layout.jquery-dev.net/