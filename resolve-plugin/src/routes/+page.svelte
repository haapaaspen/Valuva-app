<script lang="ts">
	// For now, we'll keep the script tag empty as we are focusing on the HTML and CSS structure.
	// We can add interactivity and logic later.
</script>

<div class="app-container">
	<!-- Left Sidebar -->
	<div class="sidebar left-sidebar">
		<div class="new-chat-header">NEW CHAT</div>
		<div class="chat-item">
			<span class="plus-icon">+</span>
			<div class="item-content">
				<div>Main title example</div>
				<div class="item-subtitle">flowy, italic, cool</div>
			</div>
		</div>
		<div class="chat-item">
			<span class="plus-icon">+</span>
			<div class="item-content">
				<div>Secondary title example</div>
				<div class="item-subtitle">clean, small</div>
			</div>
		</div>
		<div class="prompt-input-area">
			<input type="text" placeholder="Draft a prompt given here" />
		</div>
		<div class="action-buttons">
			<div>I want to</div>
			<button>brainstorm</button>
			<button class="final-product">create the final product</button>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="main-content">
		<div class="core-idea-section">
			<div class="core-idea-header">CORE IDEA</div>
			<div class="core-idea-text">LLM generated summary that the user can edit</div>
		</div>
		<div class="canvas-area">
			<!-- This will be the main canvas -->
		</div>
		<div class="annotation-toggle">
			<button>Toggle annotation overlay button</button>
		</div>
		<div class="toolbar">Toolbar</div>
	</div>

	<!-- Right Sidebar -->
	<div class="sidebar right-sidebar">
		<div class="effects-header">EFFECTS</div>
		<div class="effects-content">
			Add default basic text effects + dynamic controls taken from the CSS
			<br /><br />
			Dynamically updates based on the selection
		</div>
		<div class="settings-button-placeholder">[Add settings button]</div>
	</div>
</div>

<style>
	.app-container {
		display: flex;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		background-color: #2d2d2d; /* Dark background for the whole app */
		color: #e0e0e0; /* Light text color */
		height: 100vh;
		width: 100vw;
		box-sizing: border-box;
		padding: 10px;
	}

	.sidebar {
		padding: 20px;
		border-radius: 8px;
		margin: 5px;
		background-color: #3c3c3c; /* Slightly lighter dark for sidebars */
	}

	.left-sidebar {
		width: 250px; /* Fixed width for left sidebar */
		display: flex;
		flex-direction: column;
	}

	.right-sidebar {
		width: 200px; /* Fixed width for right sidebar */
		display: flex;
		flex-direction: column;
	}

	.main-content {
		flex-grow: 1; /* Main content takes remaining space */
		display: flex;
		flex-direction: column;
		padding: 10px;
		margin: 5px;
		background-color: #252525; /* Darker for content area background */
		border-radius: 8px;
	}

	.new-chat-header {
		font-size: 0.8em;
		color: #a0a0a0;
		margin-bottom: 20px;
	}

	.chat-item {
		display: flex;
		align-items: center;
		padding: 10px;
		background-color: #4a4a4a; /* Background for items */
		border-radius: 6px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.chat-item:hover {
		background-color: #5a5a5a;
	}

	.plus-icon {
		font-size: 1.5em;
		margin-right: 10px;
		color: #c0c0c0;
	}

	.item-content div:first-child {
		font-weight: bold;
		font-size: 0.9em;
	}

	.item-subtitle {
		font-size: 0.8em;
		color: #b0b0b0;
	}

	.prompt-input-area {
		margin-top: auto; /* Pushes to the bottom of its flex container part */
		margin-bottom: 15px;
		padding-top: 15px;
		border-top: 1px solid #4a4a4a;
	}

	.prompt-input-area input {
		width: calc(100% - 20px);
		padding: 10px;
		border-radius: 4px;
		border: 1px solid #555;
		background-color: #333;
		color: #e0e0e0;
	}

	.action-buttons div:first-child {
		font-size: 0.9em;
		margin-bottom: 8px;
		color: #b0b0b0;
	}

	.action-buttons button {
		display: block;
		width: 100%;
		padding: 10px;
		margin-bottom: 8px;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		background-color: #555;
		color: #e0e0e0;
		text-align: left;
	}
	.action-buttons button.final-product {
		background-color: #6a6a6a; /* Slightly different for emphasis */
	}

	.action-buttons button:hover {
		background-color: #666;
	}

	.core-idea-section {
		margin-bottom: 10px;
	}
	
	.core-idea-header {
		font-size: 0.8em;
		color: #a0a0a0;
		margin-bottom: 5px;
	}

	.core-idea-text {
		background-color: #3c3c3c;
		padding: 10px;
		border-radius: 6px;
		font-size: 0.9em;
	}

	.canvas-area {
		flex-grow: 1; /* Canvas takes most of the space in main content */
		background-color: #1e1e1e; /* Very dark for canvas */
		border-radius: 6px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #555; /* Placeholder text color */
	}
	
	.annotation-toggle {
		text-align: center;
		margin-bottom: 10px;
	}

	.annotation-toggle button {
		padding: 8px 15px;
		border-radius: 4px;
		border: none;
		background-color: #4a4a4a;
		color: #e0e0e0;
		cursor: pointer;
		font-size: 0.8em;
	}
	.annotation-toggle button:hover {
		background-color: #5a5a5a;
	}
	

	.toolbar {
		background-color: #3c3c3c;
		padding: 15px;
		text-align: center;
		border-radius: 6px;
		font-size: 0.9em;
	}

	.effects-header {
		font-size: 0.8em;
		color: #a0a0a0;
		margin-bottom: 15px;
	}

	.effects-content {
		font-size: 0.9em;
		line-height: 1.6;
		color: #c0c0c0;
		flex-grow: 1;
	}
	.settings-button-placeholder {
		margin-top: auto;
		padding-top: 10px;
		border-top: 1px solid #4a4a4a;
		text-align: right;
		font-size: 0.8em;
		color: #a0a0a0;
	}

	/* Basic button styling reset */
	button {
		font-family: inherit;
	}
</style>