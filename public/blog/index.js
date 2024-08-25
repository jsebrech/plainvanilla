import { registerBlogFooter } from "./components/blog-footer.js";
import { registerBlogHeader } from "./components/blog-header.js";
import { registerBlogLatestPosts } from "./components/blog-latest-posts.js";
import { registerBlogArchive } from "./components/blog-archive.js";
import { registerCodeViewerComponent } from "../components/code-viewer/code-viewer.js";

const app = () => {
    registerBlogLatestPosts();
    registerBlogHeader();
    registerBlogFooter();
    registerBlogArchive();
    registerCodeViewerComponent();
}

document.addEventListener('DOMContentLoaded', app);
