var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","redirectTo":"home","pathMatch":"full"},{"path":"home","component":"HomeComponent"},{"path":"simulation","loadChildren":"./ui/ui.module#UiModule","data":{"preload":false},"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/ui/ui-routing.module.ts","module":"UiRoutingModule","children":[{"path":"","component":"UiComponent"}],"kind":"module"}],"module":"UiModule"}]},{"path":"**","redirectTo":"home"}],"kind":"module"}]}
