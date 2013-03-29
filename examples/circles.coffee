require ['cv/Component', 'cv/ViewportContainer', 'cv/Circle']
      , (Component, ViewportContainer, Circle) ->
  container = ViewportContainer.create()
  container.add Circle.create 0.5, 0.5, 0.5
  Component.bindToCanvas 'circles', container
