/**
 * URL helpers for media stored on the `public` disk.
 *
 * Uploaded filenames keep their original characters, which routinely
 * include spaces, commas and parentheses. Interpolating one straight into
 * an href produces a URL that fails to resolve, so each path segment is
 * percent-encoded while the `/` separators are preserved.
 */

/**
 * Percent-encode a stored path, keeping separators intact.
 *
 * encodeURIComponent is used per segment rather than on the whole string
 * because encoding the whole thing would also escape the `/` separators.
 * Note encodeURI() would not be safe here: it leaves `#` and `?`
 * unescaped, which would truncate the URL at a fragment or query.
 */
export const encodeStoredPath = (value) => {
    const path = String(value ?? "").trim();

    if (!path) return "";

    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
};

/**
 * Resolve a stored media value to a fetchable URL.
 *
 * Accepts absolute URLs, already-rooted `/storage/...` paths, or bare
 * filenames, which are assumed to live under the given directory.
 */
export const resolveStoredUrl = (value, directory) => {
    const path = String(value ?? "").trim();

    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    if (path.startsWith("/")) {
        return encodeStoredPath(path);
    }

    return encodeStoredPath(`/${directory}/${path}`);
};