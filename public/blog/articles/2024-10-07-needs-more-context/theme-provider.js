// loaded with <script type="module" src="theme-provider.js"></script>

import { ContextProvider } from "./context-provider.js";

const themeProvider = new ContextProvider(document.body, 'theme', 'light');
const toggleProvider = new ContextProvider(document.body, 'theme-toggle', () => {
    themeProvider.value = themeProvider.value === 'light' ? 'dark' : 'light';
});
