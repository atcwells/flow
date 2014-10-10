responsive-cache-interface
==========================

A caching strategy allowing config files to be cached and updated by subsequent cache setting

Currently this just stores an object as a cache

keys can be retrieved like "get('a.b.c')"

keys can be set like "set({ a : { b: c}})"

TODO:
This will be updated to allow standard objects like above (will be the default cache type), and others, such as:

a type which reflects that the current cached keys have come from a file, and that should the keys be updated the file should also be updated.

