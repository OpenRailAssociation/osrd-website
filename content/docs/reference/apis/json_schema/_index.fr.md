---
title: "JSON Schemas"
linkTitle: "JSON Schemas"
weight: 70
---

<!-- Include from a free CDN -->
<script src="https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js"></script>

<!-- Element where the list will be created -->
<div id="container"><h1>Infrastructure</h1></div>

<script>
    // The JSObject that you want to render
var infra = {};
    tmp = $.ajax({
        url: "/schemas/infra_schema.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            infra = data;
        }
    });
    // Render toggable list in the container element
    document.getElementById("container").appendChild(
        renderjson(infra)
    );
</script>

<!-- Element where the list will be created -->
<div id="container2"><h1>Rolling Stock</h1></div>

<script>
    // The JSObject that you want to render
var rolling_stock = {};
    tmp = $.ajax({
        url: "/schemas/rolling_stock_schema.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            rolling_stock = data;
        }
    });
    // Render toggable list in the container element
    document.getElementById("container2").appendChild(
        renderjson(rolling_stock)
    );
</script>

<style>
#container, #container2 {
	text-shadow: none;
	background:;
	padding: 1em;
}

.renderjson a {
	text-decoration: none;
}

.renderjson .disclosure {
	color: #aa026d;
	font-size: 150%;
}

.renderjson .syntax {
	color: grey;
}

.renderjson .string {
	color: black;
}

.renderjson .number {
	color: cyan;
}

.renderjson .boolean {
	color: plum;
}

.renderjson .key {
	color: #aa026d;
}

.renderjson .keyword {
	color: lightgoldenrodyellow;
}

.renderjson .object.syntax {
	color: lightseagreen;
}

.renderjson .array.syntax {
	color: lightsalmon;
}
</style>
