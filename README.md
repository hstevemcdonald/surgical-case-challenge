
Hello!

Thanks for the opportunity to do this take-home project.  It was a lot of fun and I learned quite a bit.  Until now, my implementation of features in React has been on an completed application/platform where the structure/framework for Typescript and React was established and mature in so far as best practices.  In doing this project, I was able to see where there were gaps in my learning React/Typescript in a 100% deployed application vs doing many things from scratch as in this project.  I have listed several 'todos' below that I believe would make the Typescript and React implementation more complete and syntactically correct if I had the opportunity. 

tRPC, Next.js, Prisma and Tailwind were all brand new to me, so there was quite a bit of getting up to speed on all of the above in order to implement the features.

I opted to complete the main assignment, then do something a bit different for the optional work by creating an "Add Case" function and an auto-complete function within the modal for patients and surgeons.

There is quite a bit I would have liked to do if I had time, but I prioritized the main functions and the 'Add Case' fucntionality as I thought that may be the main priority given the 'backend' component of this project was very low in complexity.

If there was time and bandwidth, these are the tasks that I would do to and/or suggest as part of a PR.  I would welcome an opportunity to pick one or more of these to work on in the next stage of the interview (please let me know which in advance).

Thanks again and I look forward to hearing from you.

- Steve

Note: There is a bug in my IDE that is auto-populating an unused `props` param in the main React functional component on the 'case' and 'home' pages.  Please disregard the workaround.

## TODOS:

- Replace images with high-res images (new images currently in public/faces), update DB user attributes to reflect new image
- Create additional components that can be reused to reduce code footprint on primary pages and in general
- Consolidate handlers for any/all autocomplete fields
- Add "Time of surgery" to db and all views (I presume this would be important)
- Create/consolidate utility/helper functions to reduce code
- Combined Diagnosis text and Diagnosis code as appropriate
- Create Typescript interfaces for objects and params, implement where applicable
- Restrict the entry of information in Patient and Surgeon fields to matching autocomplete results only
- Update params types/interface references
- Add sort feature for columns on case list
- Add print/download PDF option for "Surgical Case" page
- Unit tests

## On the 'Add Case' form/operation:

- Add validation for "Add case" form
- Style header, heading and close icon for "Add case" modal
- Error handling for "Add case" and DB operations
- Add Case # to 'Case Added' confirmation
- Combine Diagnosis text and Diagnosis code into autocomplete list
- Indicate if External ID is already in use and display error
- Fix 'key' errors with autocomplete
