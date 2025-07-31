import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";
 
export const onRequest = defineMiddleware(async (context, next) => {
    try {
        const isAuthed = await auth.api.getSession({
            headers: context.request.headers,
        })
        console.log("isAuthed", isAuthed);

        if (isAuthed) {
            context.locals.user = isAuthed.user;
            context.locals.session = isAuthed.session;
        } else {
            context.locals.user = null;
            context.locals.session = null;
        }
    } catch (error) {
        // If headers can't be accessed (prerendered page), set defaults
        context.locals.user = null;
        context.locals.session = null;
    }

    return next();
});