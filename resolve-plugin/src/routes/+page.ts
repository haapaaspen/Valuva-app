

//Plugin initialization & Resolve functions
InitPlugin();
ResolveFunctions.Initialize();

//Load the global settings

//Keeping the plugin, otherwise we close the plugin.
setInterval(async () => {
  Common.LifeCyclePing(false);
}, 1000);

//This specific line is somehow always complaining.
//but it still works and its the default svelte app template.
/* @ts-ignore */
const app = new App({
  target: document.getElementById('app'),
})

export default app
