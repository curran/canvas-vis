require ['cv/Component', 'cv/ViewportContainer', 'cv/Circle']
      , (Component, ViewportContainer, Circle) ->
  container = ViewportContainer.create()
  container.add new Circle
    x: 0.5
    y: 0.5
    radius: 0.5
  Component.bindToCanvas 'circles', container
