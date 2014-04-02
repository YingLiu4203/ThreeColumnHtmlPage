// implement the resize function of three columns
var resizeColumns = (function ($) {
    var
        _commons, // imported object

        $resizeBars = $('.resizeBar'),

        // shared local variables
        // to remember the start offset of resize bar
        dragStartOffset,

        // local functions
        onDragStart, onDragStop,

        initModule, onDocumentReady, exported
    ;

    // remember the start offset of resize bar
    onDragStart = function (e, ui) {
        dragStartOffset = ui.offset;
    };


    // when user drags the resize bar we calculate 
    // the new position based on min-width of a neighbor element
    // then set the width of its floating neighbor and correct 
    // resize bar offset
    onDragStop = function (e, ui) {
        var $resize_Bar = $(e.target),
            bar_neighbors = {},
            final_position = {},

            // local functions 
            is_left_resize_bar, set_neighbors,
            calc_final_position, correct_resize_bar_offset, 
            set_floating_neighbor_width
        ;

        is_left_resize_bar = function () {
            var left_resize_bar_id = 'leftResizeBar';

            // use id to check which bar is dragged
            return $resize_Bar.attr("id") === left_resize_bar_id;
        }

        // setting the previous and next element of 
        // a dragging resize bar
        set_neighbors = function () {
            if (is_left_resize_bar($resize_Bar)) {
                bar_neighbors.$prev = _commons.$leftPanel;
                bar_neighbors.$next = _commons.$middlePanel;
            } else { // resizeBarRight
                bar_neighbors.$prev = _commons.$middlePanel;
                bar_neighbors.$next = _commons.$rightPanel;
            }
        };


        // calculate the final position parameters: left and distance
        calc_final_position = function (uiOffsetLeft) {
            var get_max_distance, max_left_distance,
                max_right_distance, stop_left, stop_distance
            ;

            // find the max dragging distance based 
            // on min-width of neighbor element
            get_max_distance = function ($panel) {
                // to compensate rounding error in calculating drag distance
                var min_Width_Extra_Pixels = 2,
                    current_Width, min_Width
                ;

                current_Width = $panel.width();
                min_Width = parseInt($panel.css("min-width"), 10) +
                    min_Width_Extra_Pixels;
                return current_Width - min_Width;
            };

            max_left_distance = get_max_distance(bar_neighbors.$prev);
            max_right_distance = get_max_distance(bar_neighbors.$next);

            var stop_left = uiOffsetLeft;
            var stop_distance = stop_left - dragStartOffset.left;
            if (stop_distance < 0) { // drag to left
                if (Math.abs(stop_distance) > max_left_distance) {
                    stop_distance = -max_left_distance;
                    stop_left = dragStartOffset.left + stop_distance;
                }
            } else {
                if (stop_distance > max_right_distance) {
                    stop_distance = max_right_distance;
                    stop_left = dragStartOffset.left + stop_distance;
                }
            }

            final_position.stopLeft = stop_left;
            final_position.stopDistance = stop_distance;
        };

        // When resizeBar is floating, jQuery adjust
        // its 'left' position with the changed distance. 
        // To correct it, we need to pre-add the distance back here
        // this has to be called before set neighbor width
        correct_resize_bar_offset = function () {
            $resize_Bar.offset({
                top: $resize_Bar.offset().top,
                left: final_position.stopLeft - final_position.stopDistance
            });
        };

        set_floating_neighbor_width = function () {
            var prev_width_old, prev_width_new,
                next_width_old, next_width_new
            ;

            // the middle panel is BFC, thus only need to adjust one side
            if (is_left_resize_bar($resize_Bar)) {
                prev_width_old = bar_neighbors.$prev.width();
                var prev_width_new = prev_width_old + final_position.stopDistance;
                bar_neighbors.$prev.width(prev_width_new);
            } else { // resizeBarRight
                var next_width_old = bar_neighbors.$next.width();
                var next_width_new = next_width_old - final_position.stopDistance;
                bar_neighbors.$next.width(next_width_new);
            }
        };

        // the function body
        set_neighbors();

        calc_final_position(ui.offset.left);

        // adjust offset before change panel width
        correct_resize_bar_offset();
        set_floating_neighbor_width();

    };

    initModule = function (commons) {
        _commons = commons;
    }

    onDocumentReady = function () {

        var drag_config_map = {
            iframeFix: true,
            axis: "x",
            start: function (e, ui) {
                onDragStart(e, ui);
            },
            stop: function (e, ui) {
                onDragStop(e, ui);
            }
        };

        // resize functions
        $resizeBars.draggable(drag_config_map);
    };


    exported = {
        initModule: initModule,
        onDocumentReady: onDocumentReady
    };

    return exported;
})(jQuery);