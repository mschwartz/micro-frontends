# micro-frontends
Playground for micro frontends

See what I call the "spec" here:
    https://micro-frontends.org/

## Notes

### React vs. DOM / WebComponent patterns

The patterns are quite similar.  The life cycle of WebComponents has all the events/methods you would use in React, using classes.  For example, componentDidMount() is mirrored by connectedCallbac(), and so on.

What React provides is JSX which is a bit more powerful for generating HTML.  

React also optimizes rendering so the same HTML content is not added to the DOM over and over.  

React provides an excellent CSS-AS-JS methodology and can be just specified inline in the JSX.  I wrote a function objectToCSS() that takes a JavaScript object of similar syntax to React's and turns it into CSS string.  However, it's not fully compatible and has a few edge case issues.  It can be fixed with a bit more work.

The index.html for the WebComponent is very declarative.  In React, you just get a single DIV and the HTML is generated entirely in JavaScript.

### Anti Patterns

CSS is ugly and awful to use in practice, and it ends up roughly doubling the number of files in a project if you have one .css file per component.  This is probably the way micro-frontends should be done, but it seems like declaring the CSS in the same source as the component makes it very easy to accomplish the look you want.  

It seems like having a single global object with default styles that can be copied andmodified by components allows for a  consistent theme throughout the application that can be trivially changed in one place.

The micro-frontends spec suggests each team have isolated code bases and to not use any framework.  This seems like it breaks one of the valuable concept in software engineering - code reuse.  If you are copy/pasting the same logic into multiple components, or similar code is implemented by another team, it's that many more places to fix something that's broken across the app.

There are really great frameworks to use on the WWW.  I especially like Twitter Bootstrap.  Why force everyone on all teams to hand craft CSS, HTML,  and JavaScript behavor to do what Bootstrap does elegantly and consistently.  We all have the DOM API as a common reference, per the spec.  It's no more difficult to have Bootstrap as a common reference as well.

The spec suggests each team stand up its own ExpressJS server, with Nginx doing reverse proxy for all of them.  Even to the point you have one server instance per component.  I imagine a Web App with hundreds of components and see hundreds of points of failure and a DevOps deployment nightmare.  For this demo, I stand up one ExpressJS server and serve the Web Components JavaScript files statically.

The index.html file is a single point of contention.  Every team wants to modify it to add markup as the project gets flushed out.

The spec suggests using server side includes.  It is just as easy to just use <script> tags to load in JavaScript and use the declarative WebComponents HTML syntax within HTML.

MQTT is a pain point for the spec.  I implemented a single MQTT singleton with appropriate methods to publish, subscribe, and unsubscribe.  An application with 100 components using MQTT should not need 100 instances of MQTT.  What it should require is potentially 100 subscriptions, which is exactly what MQTT is meant to do.

Using the DOM API encourages the modification/enhancement of built in objects using the prototype of the base class.  For example, I would like to add Object.prototype.toCSS() method that takes the object and converts it to a styntactically correct string for use in HTML.


