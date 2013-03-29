# This example creates a canvas with a draggable circle.
require ['cv/Component', 'cv/ViewportContainer', 'cv/Circle']
     , (Component, ViewportContainer, Circle) ->
  
  # A `ViewportContainer` has a default viewport of (0,0,1,1),
  # and can contain child components that draw themselves.
  container = ViewportContainer.create()

  # A new `Circle` is created that is draggable with the mouse.
  circle = Circle.create 0.5, 0.5, 0.2
  circle.on 'drag', (x, y) ->
    circle.setXY x, y

  window.c = container

  # That circle is added to the container, which handles
  # rendering and events.
  container.add circle

  # `bindToCanvas` sets up the container to be actualized on
  # the Canvas element with the id 'movableCircle'.
  Component.bindToCanvas 'draggableCircle', container
