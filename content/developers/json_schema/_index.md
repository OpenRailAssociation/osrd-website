---
title: "JSON Schemas"
linkTitle: "JSON Schemas"
weight: 40
---

<!-- Include from a free CDN -->
<script src="https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js"></script>

<!-- Element where the list will be created -->
<div id="container"><h1>Infra</h1></div>

<script>
    // The JSObject that you want to render
var infra = {};
    tmp = $.ajax({
        url: "infra.json",
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
<div id="container2"><h1>Train Schedule</h1></div>

<script>
    // The JSObject that you want to render
var train_schedule = {};
    tmp = $.ajax({
        url: "train_schedule.json",
        async: false,
        dataType: 'json',
        success: function(data) {
            train_schedule = data;
        }
    });
    // Render toggable list in the container element
    document.getElementById("container2").appendChild(
        renderjson(train_schedule)
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
