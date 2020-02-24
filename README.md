# Notables

This is a note aplication that stores data in the users local browser storage

#**[Notables](https://wallythewebdev.github.io/Notables/)**

This app uses the CRUD method and IFFIE functions to allow only the controller to accsess functions

**Create**

- [] Notes are saved to the UI for the users.
- [] Notes are stored in a object and converted to JSON to be passed to the browsers local storage

**Read**

- [] Notes are retried from the browser local storage JSON file and converted to a JS Obj
This is then populate to the UI for the user to view

**Update**

- [] Editing a note allows you to update the title and description, this edits the note data and reloads the notes
with the updated details

**Delete**

- [] This did not suit the purpose of the App that I was creating - 
however, completing a note will re-crceate the note under the completed notes obj and remove
it from the current notes Obj


**planning**

This aplcation was developed using a moduel approach

**UI**

modules here will update the users UI

**back end controlls**

modules will update the stored data

**controller**

will initiate the UI and backend working together