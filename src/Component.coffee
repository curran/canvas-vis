# Component
# =========
#
# Renders to a Canvas, responds to events.
#
#   * paint(ctx:CanvasContext, bounds:Rectangle),
#     renders to a Canvas within the `bounds` rectangle.
#   * 'graphicsDirty' event fired when repaint needed
#     * `component.on 'graphicsDirty', -> (do stuff)
#     * `component.trigger 'graphicsDirty'
define [], -> Backbone.Model.extend()
