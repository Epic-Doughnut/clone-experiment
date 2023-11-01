// @ts-nocheck
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(`<!doctype html><html><body>
<body>
	<button id="darkModeToggle">Light Mode</button>
	<button id="saveButton" onclick="saveGame()">Save</button>
	<button id="deleteSaveButton" onclick="localStorage.removeItem('save'); location.reload();">Delete Save
		Data</button>
	<!-- Level up -->


	<!-- For cutscenes -->
	<div id="overlay">
		<p id="overlay-text">That fish didn't taste too good, hopefully you won't need to pilot any airplanes. Who's
			that standing there?</p>
		<button id="overlay-button" onclick="hideOverlay()">Continue</button>
	</div>

	<!-- SIDEBAR -->

	<div id="sidebar">
		<h4 id='resourcesWords' class='startVisible'>Resources</h4>
		<div id="resources">
			<!-- Resource values here -->
		</div>

		<div id="tools" class='craftRocks'>
			<hr>
			<h4>Tools:</h4>
			<ul id="tools-list">
				<!-- List of our tools -->
			</ul>
		</div>
	</div>

	<!-- Tab content -->
	<div class="tab-content" id="main">
		<div style="display: flex; flex-direction: column;">
			<h3 class="startVisible" id="message"> You find yourself
				<span id='alone' title="You feel peckish for some seafood">alone</span>
				in a forest
			</h3>
			<div id='emojiGatherDisplay'>𓀟</div>
			<div id="emojiDisplay">𓆮
			</div>

			<div id="levelUpMessage" class="hidden">
				<p>Level up!</p>
			</div>
		</div>
		<button class="eatFish" id="eatFish" onclick='eatFish()'>Eat fish</button>
		<!-- <button onclick="fadeToBlack()">blackout</button> -->

		<!-- PRODUCTION TAB (1) -->
		<div id="productionTab" class="content active" data-target='productionTab'></div>


		<!-- EXPERIMENT TAB (2) -->
		<div id="experimentTab" class="experiment-tab content" data-target='experimentTab'>
			<div class="button-columns visible active">
				<!-- This is where you will append the columns of buttons -->
			</div>

			<div class="rows visible active craftRocks rope" id="craftedResourceButtons">

			</div>
		</div>


		<!-- PONDER TAB (3) -->
		<div id='ponderTab' class='ponder-tab content' data-target='ponderTab'>
		</div>


		<!-- JOBS TAB (4) -->
		<div id='jobsTab' class='jobs-tab content' data-target='jobsTab'>
			<p id="jobs-total">Assigned Clones:</p>
			<button id="clearJobAssignments" onclick="clearJobAssignments();">Clear Assignments</button>

			<canvas id="lineCanvas" style="position: absolute; top: 0; left: 0; z-index: -1;"></canvas>

		</div>


		<div id="skillsTab" class="skillsTab content" data-target="skillsTab">

			<table id="skillsTable" class='dark-mode'>
				<tr>
					<td>
						<h4 style='display: block;'>Your Skills:</h4>
					</td>
				</tr>
			</table>
		</div>

		<div id="perksTab" class="perksTab content" data-target="perksTab">
			<div id="tierOneContainer">
				<button class="tierOneButton tooltip" tooltipCost="Mutually Exclusive!"
					tooltipDesc="+25% wood & sticks production"
					onclick="selectAbility('Lumberjack')">Lumberjack</button>
				<button class="tierOneButton tooltip" tooltipCost="Mutually Exclusive!"
					tooltipDesc="+25% stone & ore production" onclick="selectAbility('Miner')">Miner</button>
				<button class="tierOneButton tooltip" tooltipCost="Mutually Exclusive!"
					tooltipDesc="+25% vines & herbs & wheat production"
					onclick="selectAbility('Botanist')">Botanist</button>
				<button class="tierOneButton tooltip" tooltipCost="Mutually Exclusive!"
					tooltipDesc="+50% clones productivity" onclick="selectAbility('Leader')">Leader</button>
				<button class="tierOneButton tooltip" tooltipCost="Mutually Exclusive!" tooltipDesc="-25% building cost"
					onclick="selectAbility('Architect')">Architect</button>
			</div>


		</div>
	</div>

	<!-- Tabs navigation -->
	<div id="tabs">
	</div>

	<!-- TOOL -->
	<!-- The button to trigger the form display -->
	<!-- <button id="addResourceBtn" class="hidden">Add New Resource</button> -->

	<!-- The form to input resource details -->
	<div id="resourceForm" style="display: none;">
		<label for="resourceName">Resource Name:</label>
		<input type="text" id="resourceName">

		<label for="resourceActiveText">Active Text:</label>
		<input type="text" id="resourceActiveText">

		<label for="resourceDefaultText">Default Text:</label>
		<input type="text" id="resourceDefaultText">

		<!-- ... Add other fields as needed ... -->
		<label for="btnText">Button Text:</label>
		<input type="text" id="btnText">

		<label for="btnTooltipDesc">Tooltip Description:</label>
		<input type="text" id="btnTooltipDesc">

		<label for="btnTooltipCost">Tooltip Cost:</label>
		<input type="text" id="btnTooltipCost">

		<button onclick="addResource()">Add Resource</button>
	</div>



	<div id="dynamic-tooltip" class="dynamic-tooltip"></div>

</body></html>`);

global.window = jsdom.window;
global.document = jsdom.window.document;
