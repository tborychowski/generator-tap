<header class="header">
	<h1>App Name</h1>
	<button class="btn" on:click="{action}">Action</button>
	<input placeholder="search">
</header>


<script>
import {list} from '../data/store';


function action (e) {
	console.log(list);
	console.log(e.target);
}

</script>
