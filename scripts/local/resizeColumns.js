// implement the resize function of three columns
var resizeColumns = (function ($) {

    // defined variables and functions
    var _commons;

    // to compensate rounding error in calculating drag distance
    var minWidthExtraPixels = 2;

    var $resizeBars = $('.resizeBar');
    var leftResizeBarId = 'leftResizeBar';

    // shared local variables
    // to remember the start offset of resize bar
    var dragStartOffset;

    var isLeftResizeBar = function ($resizeBar) {
        // use id to check which bar is dragged
        return $resizeBar.attr("id") === leftResizeBarId;
    }

    // remember the start offset of resize bar
    var onDragStart = function (e, ui) {
        dragStartOffset = ui.offset;
    };

    // setting the previous and next element of 
    // a dragging resize bar
    var setNeighbors = function ($resizeBar, neighbors) {
        if (isLeftResizeBar($resizeBar)) {
            neighbors.$prev = _commons.$leftPanel;
            neighbors.$next = _commons.$middlePanel;
        } else { // resizeBarRight
            neighbors.$prev = _commons.$middlePanel;
            neighbors.$next = _commons.$rightPanel;
        }
    };

    // find the max dragging distance based 
    // on min-width of neighbor element
    var getMaxDistance = function ($panel) {
        var currentWidth = $panel.width();
        var minWidth = parseInt($panel.css("min-width"), 10) +
            minWidthExtraPixels;
        return currentWidth - minWidth;
    };

    // calculate the final position parameters: left and distance
    var calcFinalPosition = function (uiOffsetLeft, neighbors, finalPosition) {
        var maxLeftDistance = getMaxDistance(neighbors.$prev);
        var maxRightDistance = getMaxDistance(neighbors.$next);

        var stopLeft = uiOffsetLeft;
        var stopDistance = stopLeft - dragStartOffset.left;
        if (stopDistance < 0) { // drag to left
            if (Math.abs(stopDistance) > maxLeftDistance) {
                stopDistance = -maxLeftDistance;
                stopLeft = dragStartOffset.left + stopDistance;
            }
        } else {
            if (stopDistance > maxRightDistance) {
                stopDistance = maxRightDistance;
                stopLeft = dragStartOffset.left + stopDistance;
            }
        }

        finalPosition.stopLeft = stopLeft;
        finalPosition.stopDistance = stopDistance;
    };

    // When resizeBar is floating, jQuery adjust
    // its 'left' position with the changed distance. 
    // To correct it, we need to pre-add the distance back here
    // this has to be called before set neighbor width
    var correctReizeBarOffset = function ($resizeBar, finalPosition) {
        $resizeBar.offset({
            top: $resizeBar.offset().top,
            left: finalPosition.stopLeft - finalPosition.stopDistance
        });
    };

    var setFloatingNeighborWidth = function ($resizeBar, neighbors, finalPosition) {
        // the middle panel is BFC, thus only need to adjust one side
        if (isLeftResizeBar($resizeBar)) {
            var prevWidthOld = neighbors.$prev.width();
            var prevWidthNew = prevWidthOld + finalPosition.stopDistance;
            neighbors.$prev.width(prevWidthNew);
        } else { // resizeBarRight
            var nextWidthOld = neighbors.$next.width();
            var nextWidthNew = nextWidthOld - finalPosition.stopDistance;
            neighbors.$next.width(nextWidthNew);
        }
    };

    // when user drags the resize bar we calculate 
    // the new position based on min-width of a neighbor element
    // then set the width of its floating neighbor and correct 
    // resize bar offset
    var onDragStop = function (e, ui) {
        var $resizeBar = $(e.target);
        var neighbors = {};
        setNeighbors($resizeBar, neighbors);

        var finalPosition = {};
        calcFinalPosition(ui.offset.left, neighbors, finalPosition);

        // adjust offset before change panel width
        correctReizeBarOffset($resizeBar, finalPosition);
        setFloatingNeighborWidth($resizeBar, neighbors, finalPosition);
        
    };

    var initModule = function(commons) {
        _commons = commons;
    }

    var onDocumentReady = function () {
        // resize functions
        $resizeBars.draggable({
            iframeFix: true,
            axis: "x",
            start: function (e, ui) {
                onDragStart(e, ui);
            },
            stop: function (e, ui) {
                onDragStop(e, ui);
            }
        });
    };

    var exported = {
        initModule: initModule,
        onDocumentReady: onDocumentReady
    };

    return exported;
})(jQuery);