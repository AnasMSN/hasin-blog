# My Daily Blog

This repository hosts a blog that is automatically published via GitHub Pages.

## How to Write a New Post

1.  Navigate to the `_posts` folder.
2.  Create a new file.
3.  **Important:** Name the file with the format `YYYY-MM-DD-title-of-post.md`.
    *   Example: `2024-03-15-my-day.md`
4.  Copy the following header (front matter) to the top of your new file:

    ```markdown
    ---
    layout: post
    title:  "Your Post Title Here"
    date:   2024-03-15 12:00:00 +0900
    categories: blog
    ---
    ```
5.  Write your content below the header using Markdown.
6.  Commit (save) and push your changes to GitHub.

## Initial Setup (One Time Only)

1.  Push this code to your GitHub repository.
2.  Go to your repository on GitHub.
3.  Click on **Settings**.
4.  On the left sidebar, click **Pages**.
5.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
6.  Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
7.  Click **Save**.

Your site will be live at `https://<your-username>.github.io/<repo-name>/` in a few minutes.
# hasin-blog
